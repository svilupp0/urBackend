const mongoose = require("mongoose")
const Project = require("../models/Project")
const { createProjectSchema, createCollectionSchema } = require('../utils/input.validation');
const { generateApiKey, hashApiKey } = require('../utils/api');
const { z } = require('zod');



// CONFIGURATION
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
exports.supabase = supabase;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB Limit


module.exports.createProject = async (req, res) => {
    try {
        // Validation Applied
        const { name, description } = createProjectSchema.parse(req.body);

        const rawApiKey = generateApiKey()
        const hashedkey = hashApiKey(rawApiKey);

        const rawSecret = generateApiKey()

        const newProject = new Project({
            name,
            description,
            owner: req.user._id,
            apiKey: hashedkey,
            jwtSecret: rawSecret
        });
        await newProject.save();

        const projectObj = newProject.toObject();
        projectObj.apiKey = rawApiKey;
        delete projectObj.jwtSecret;

        res.status(201).json(projectObj);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        res.status(500).json({ error: err.message });
    }
}

module.exports.getAllProject = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id }).select('-apiKey -jwtSecret');
        res.status(200).json(projects); // Fixed: .json()
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports.getSingleProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id }).select('-apiKey -jwtSecret');
        if (!project) return res.status(404).json({ error: "Project not found." });

        const projectObj = project.toObject();
        delete projectObj.apiKey;
        delete projectObj.jwtSecret;
        res.json(projectObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.regenerateApiKey = async (req, res) => {
    try {
        const newApiKey = generateApiKey();
        const hashed = hashApiKey(newApiKey);

        const project = await Project.findOneAndUpdate(
            { _id: req.params.projectId, owner: req.user._id },
            { $set: { apiKey: hashed } },
            { new: true }
        );
        if (!project) return res.status(404).json({ error: "Project not found." });

        const projectObj = project.toObject();
        delete projectObj.apiKey;
        delete projectObj.jwtSecret;
        res.json({ apiKey: newApiKey, project: projectObj });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.createCollection = async (req, res) => {
    try {
        const { projectId, collectionName, schema } = createCollectionSchema.parse(req.body);

        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const exists = project.collections.find(c => c.name === collectionName);
        if (exists) return res.status(400).json({ error: 'Collection already exists' });

        if (!project.jwtSecret) project.jwtSecret = uuidv4();

        project.collections.push({ name: collectionName, model: schema });
        await project.save();

        // Safe Response
        const projectObj = project.toObject();
        delete projectObj.apiKey;
        delete projectObj.jwtSecret;

        res.status(201).json(projectObj);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        res.status(500).json({ error: err.message });
    }
}

module.exports.getData = async (req, res) => {
    try {
        const { projectId, collectionName } = req.params;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ error: "Project not found." });

        const finalCollectionName = `${project._id}_${collectionName}`;
        const collectionsList = await mongoose.connection.db.listCollections({ name: finalCollectionName }).toArray();

        let data = [];
        if (collectionsList.length > 0) {
            data = await mongoose.connection.db.collection(finalCollectionName).find({}).limit(50).toArray();
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.insertData = async (req, res) => {
    try {
        const { projectId, collectionName } = req.params;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ error: "Project not found." });

        const finalCollectionName = `${project._id}_${collectionName}`;
        const incomingData = req.body;
        const docSize = Buffer.byteLength(JSON.stringify(incomingData));
        const limit = project.databaseLimit || 50 * 1024 * 1024;

        if ((project.databaseUsed || 0) + docSize > limit) {
            return res.status(403).json({ error: "Database limit exceeded. Delete some data." });
        }

        const result = await mongoose.connection.db
            .collection(finalCollectionName)
            .insertOne(incomingData);

        project.databaseUsed = (project.databaseUsed || 0) + docSize;
        await project.save();

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.deleteRow = async (req, res) => {
    try {
        const { projectId, collectionName, id } = req.params;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ error: "Project not found." });

        const finalCollectionName = `${project._id}_${collectionName}`;
        const collection = mongoose.connection.db.collection(finalCollectionName);

        const docToDelete = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (docToDelete) {
            const docSize = Buffer.byteLength(JSON.stringify(docToDelete));
            await collection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
            project.databaseUsed = Math.max(0, (project.databaseUsed || 0) - docSize);
            await project.save();
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

module.exports.listFiles = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ error: "Project not found" });

        const { data, error } = await supabase.storage.from('dev-files').list(`${projectId}`, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
        });

        if (error) throw error;

        const files = data.map(file => {
            const { data: publicUrlData } = supabase.storage.from("dev-files").getPublicUrl(`${projectId}/${file.name}`);
            return { ...file, publicUrl: publicUrlData.publicUrl, path: `${projectId}/${file.name}` };
        });

        res.json(files);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

module.exports.uploadFile = async (req, res) => {
    try {
        const { projectId } = req.params;
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ error: "Project not found" });

        if (project.storageUsed + file.size > project.storageLimit) {
            return res.status(403).json({ error: "Storage limit exceeded. Delete some files." });
        }

        const fileName = `${projectId}/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

        const { error } = await supabase.storage.from("dev-files").upload(fileName, file.buffer, {
            contentType: file.mimetype
        });

        if (error) throw error;

        project.storageUsed += file.size;
        await project.save();

        res.json({ message: "Uploaded" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.deleteFile = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { path } = req.body;

        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ error: "Project not found" });

        const { error } = await supabase.storage.from('dev-files').remove([path]);
        if (error) throw error;

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.deleteAllFiles = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ error: "Project not found" });

        let deletedCount = 0;
        let hasMore = true;

        while (hasMore) {
            const { data: files, error } = await supabase.storage
                .from('dev-files')
                .list(projectId, { limit: 100 });

            if (error) throw error;

            if (files && files.length > 0) {
                const paths = files.map(f => `${projectId}/${f.name}`);
                const { error: delError } = await supabase.storage
                    .from('dev-files')
                    .remove(paths);

                if (delError) throw delError;
                deletedCount += files.length;
            } else {
                hasMore = false;
            }
        }

        res.json({ success: true, count: deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.updateProject = async (req, res) => {
    try {
        const { name } = req.body;
        const project = await Project.findOneAndUpdate(
            { _id: req.params.projectId, owner: req.user._id },
            { $set: { name } },
            { new: true }
        );
        if (!project) return res.status(404).json({ error: "Project not found." });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ error: "Project not found or access denied." });

        for (const col of project.collections) {
            const collectionName = `${project._id}_${col.name}`;
            try {
                await mongoose.connection.db.dropCollection(collectionName);
            } catch (e) { }
        }

        try {
            await mongoose.connection.db.dropCollection(`${project._id}_users`);
        } catch (e) { }

        let hasMoreFiles = true;
        while (hasMoreFiles) {
            const { data: files, error } = await supabase.storage
                .from('dev-files')
                .list(`${projectId}`, { limit: 100 });

            if (error) throw error;

            if (files && files.length > 0) {
                const pathsToRemove = files.map(f => `${projectId}/${f.name}`);
                const { error: removeError } = await supabase.storage
                    .from('dev-files')
                    .remove(pathsToRemove);

                if (removeError) throw removeError;
            } else {
                hasMoreFiles = false;
            }
        }

        await Project.deleteOne({ _id: projectId });
        res.json({ message: "Project and all associated resources deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports.analytics = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findOne({ _id: projectId });
        const totalRequests = await Log.countDocuments({ projectId });
        const logs = await Log.find({ projectId }).sort({ timestamp: -1 }).limit(50);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const chartData = await Log.aggregate([
            { $match: { projectId: new mongoose.Types.ObjectId(projectId), timestamp: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            storage: { used: project.storageUsed, limit: project.storageLimit },
            database: { used: project.databaseUsed, limit: project.databaseLimit },
            totalRequests,
            logs,
            chartData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}