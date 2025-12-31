const Project = require('../models/Project');
const { hashApiKey } = require('../utils/api');

module.exports = async (req, res, next) => {
    try {
        const apiKey = req.header('x-api-key');

        if (!apiKey) return res.status(401).json({ error: 'API key not found' });

        const hashedApi = hashApiKey(apiKey);


        const project = await Project.findOne({ apiKey: hashedApi })
            .populate('owner', 'isVerified');
        if (!project) return res.status(401).json(
            {
                "error": "API key is expired or invalid.",
                "action": "Please use a valid API key or regenerate a new one from the dashboard."
            }
        );

        if (!project.owner.isVerified) return res.status(401).json({ error: 'Owner not verified', fix: 'Verify your account on https://urbackend.bitbros.in/dashboard' });
        req.project = project;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};