const Project = require('../models/Project');

module.exports = async (req, res, next) => {
    try {
        const apiKey = req.header('x-api-key');

        if (!apiKey) return res.status(401).send('API key not found');

        const project = await Project.findOne({ apiKey });
        if (!project) return res.status(401).send('Invalid API key');

        req.project = project;
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};