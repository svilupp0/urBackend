const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer'); // Added Multer
const { createClient } = require('@supabase/supabase-js'); // Added Supabase

// --- CONFIGURATION ---
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB Limit

// 1. CREATE PROJECT
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        const newProject = new Project({
            name,
            description,
            owner: req.user._id,
            apiKey: uuidv4(),
            jwtSecret: uuidv4()
        });
        await newProject.save();
        res.status(201).send(newProject);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// 2. GET ALL PROJECTS
router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id }).select('-apiKey -jwtSecret');
        res.status(200).send(projects);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// 3. GET SINGLE PROJECT
router.get('/:projectId', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id }).select('-apiKey -jwtSecret');
        if (!project) return res.status(404).send("Project not found.");
        res.json(project);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 4. REGENERATE API KEY
router.patch('/:projectId/regenerate-key', authMiddleware, async (req, res) => {
    try {
        const newApiKey = uuidv4();
        const project = await Project.findOneAndUpdate(
            { _id: req.params.projectId, owner: req.user._id },
            { $set: { apiKey: newApiKey } },
            { new: true }
        );
        if (!project) return res.status(404).send("Project not found.");
        res.json({ apiKey: project.apiKey });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 5. CREATE COLLECTION
router.post('/collection', authMiddleware, async (req, res) => {
    try {
        const { projectId, collectionName, schema } = req.body;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).send('Project not found');

        const exists = project.collections.find(c => c.name === collectionName);
        if (exists) return res.status(400).send('Collection already exists');

        if (!project.jwtSecret) project.jwtSecret = uuidv4(); // Patch old projects

        project.collections.push({ name: collectionName, model: schema });
        await project.save();

        project.apiKey = undefined;
        project.jwtSecret = undefined;
        res.status(201).send(project);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// --- INTERNAL DATA ROUTES ---

// 6. GET DATA
router.get('/:projectId/collections/:collectionName/data', authMiddleware, async (req, res) => {
    try {
        const { projectId, collectionName } = req.params;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).send("Project not found.");

        const finalCollectionName = `${project._id}_${collectionName}`;
        const collectionsList = await mongoose.connection.db.listCollections({ name: finalCollectionName }).toArray();

        let data = [];
        if (collectionsList.length > 0) {
            data = await mongoose.connection.db.collection(finalCollectionName).find({}).limit(50).toArray();
        }
        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 7. DELETE ROW
router.delete('/:projectId/collections/:collectionName/data/:id', authMiddleware, async (req, res) => {
    try {
        const { projectId, collectionName, id } = req.params;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).send("Project not found.");

        const finalCollectionName = `${project._id}_${collectionName}`;
        await mongoose.connection.db.collection(finalCollectionName).deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// --- INTERNAL STORAGE ROUTES ---

// 8. LIST FILES
router.get('/:projectId/storage/files', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).send("Project not found");

        // List files in the project's folder
        const { data, error } = await supabase.storage.from('dev-files').list(`${projectId}`, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
        });

        if (error) throw error;

        // Generate public URLs
        const files = data.map(file => {
            const { data: publicUrlData } = supabase.storage.from("dev-files").getPublicUrl(`${projectId}/${file.name}`);
            return { ...file, publicUrl: publicUrlData.publicUrl, path: `${projectId}/${file.name}` };
        });

        res.json(files);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 9. UPLOAD FILE (Internal)
router.post('/:projectId/storage/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { projectId } = req.params;
        const file = req.file;
        if (!file) return res.status(400).send("No file uploaded");

        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).send("Project not found");

        const fileName = `${projectId}/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

        const { error } = await supabase.storage.from("dev-files").upload(fileName, file.buffer, {
            contentType: file.mimetype
        });

        if (error) throw error;
        res.json({ message: "Uploaded" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 10. DELETE FILE
router.post('/:projectId/storage/delete', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { path } = req.body;

        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).send("Project not found");

        const { error } = await supabase.storage.from('dev-files').remove([path]);
        if (error) throw error;

        res.json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.delete('/:projectId', authMiddleware, async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // 1. Find Project
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).send("Project not found or access denied.");

        // 2. Delete All Collections (Data)
        for (const col of project.collections) {
            const collectionName = `${project._id}_${col.name}`;
            try {
                await mongoose.connection.db.dropCollection(collectionName);
                console.log(`Dropped collection: ${collectionName}`);
            } catch (e) {
                // Ignore if collection doesn't exist
            }
        }

        // 3. Delete 'users' collection
        try {
            await mongoose.connection.db.dropCollection(`${project._id}_users`);
        } catch (e) { }

        // 4. Delete Storage Files (Supabase Loop Fix)
        // Loop chalayenge jab tak folder khali na ho jaye
        let hasMoreFiles = true;
        while (hasMoreFiles) {
            const { data: files, error } = await supabase.storage
                .from('dev-files')
                .list(`${projectId}`, { limit: 100 }); // Default limit 100 hoti hai

            if (error) throw error;

            if (files && files.length > 0) {
                const pathsToRemove = files.map(f => `${projectId}/${f.name}`);
                const { error: removeError } = await supabase.storage
                    .from('dev-files')
                    .remove(pathsToRemove);

                if (removeError) throw removeError;
                console.log(`Deleted batch of ${files.length} files`);
            } else {
                hasMoreFiles = false; // Files khatam
            }
        }

        // 5. Delete Project Document
        await Project.deleteOne({ _id: projectId });

        res.send({ message: "Project and all associated resources deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
module.exports = router;