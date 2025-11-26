const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// 1. CREATE PROJECT (Returns API Key ONCE)
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
        res.status(201).send(newProject); // Yahan key wapis jayegi (sirf creation par)
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// 2. GET ALL PROJECTS (Hide Keys)
router.get('/', authMiddleware, async (req, res) => {
    try {
        // .select('-apiKey -jwtSecret') sensitive data hata dega
        const projects = await Project.find({ owner: req.user._id }).select('-apiKey -jwtSecret');
        res.status(200).send(projects);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})

// 3. GET SINGLE PROJECT (Hide Keys)
router.get('/:projectId', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.projectId,
            owner: req.user._id
        }).select('-apiKey -jwtSecret'); // KEY EXCLUDED HERE

        if (!project) return res.status(404).send("Project not found.");

        res.json(project);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 4. REGENERATE API KEY (New Route)
router.patch('/:projectId/regenerate-key', authMiddleware, async (req, res) => {
    try {
        const newApiKey = uuidv4();

        const project = await Project.findOneAndUpdate(
            { _id: req.params.projectId, owner: req.user._id },
            { $set: { apiKey: newApiKey } },
            { new: true } // Return updated doc
        );

        if (!project) return res.status(404).send("Project not found.");

        // Sirf naya key bhejo
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

        project.collections.push({
            name: collectionName,
            model: schema
        });

        await project.save();
        // Return project but hide keys again just in case
        project.apiKey = undefined;
        project.jwtSecret = undefined;

        res.status(201).send(project);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;