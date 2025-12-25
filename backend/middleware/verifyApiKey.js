const Project = require('../models/Project');

module.exports = async (req, res, next) => {
    try {
        const apiKey = req.header('x-api-key');

        if (!apiKey) return res.status(401).json({ error: 'API key not found' });

        const project = await Project.findOne({ apiKey })
            .populate('owner', 'isVerified');
        if (!project) return res.status(401).json({ error: 'Invalid API key' });

        if (!project.owner.isVerified) return res.status(401).json({ error: 'Owner not verified', fix: 'Verify your account on https://urbackend.bitbros.in/dashboard' });
        req.project = project;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};