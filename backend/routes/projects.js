const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

router.post('/', authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        const { name, description } = req.body;
        const newProject = new Project({
            name,
            description,
            owner: req.user._id,
            apiKey: uuidv4(),      // API Key (Public access ke liye)
            jwtSecret: uuidv4()    // NEW: Secret Key (Tokens sign karne ke liye)
        });
        await newProject.save();
        res.status(201).send(newProject);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id });
        console.log(projects)
        res.status(200).send(projects);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})

// POST /api/projects/collection
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
        res.status(201).send(project);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
