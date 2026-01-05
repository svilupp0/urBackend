const { sanitize } = require("../utils/input.validation");
const mongoose = require('mongoose');
const Project = require("../models/Project");
const { getConnection } = require("../utils/connectionManager");
const { getCompiledModel } = require("../utils/injectModel");

// 1. INSERT DATA
module.exports.insertData = async (req, res) => {
    try {
        const { collectionName } = req.params;
        const project = req.project; // Middleware se mila project metadata

        const collectionConfig = project.collections.find(c => c.name === collectionName);
        if (!collectionConfig) return res.status(404).json({ error: "Collection not found" });

        const schemaRules = collectionConfig.model;
        const incomingData = req.body;
        const cleanData = {};

        // Validation & Sanitization
        for (const field of schemaRules) {
            if (field.required && incomingData[field.key] === undefined) {
                return res.status(400).json({ error: `Field '${field.key}' is required.` });
            }
            if (incomingData[field.key] !== undefined) {
                // Type Checks
                if (field.type === 'Number' && typeof incomingData[field.key] !== 'number') return res.status(400).send(`Field '${field.key}' must be a Number.`);
                if (field.type === 'Boolean' && typeof incomingData[field.key] !== 'boolean') return res.status(400).send(`Field '${field.key}' must be a Boolean.`);
                cleanData[field.key] = incomingData[field.key];
            }
        }

        const safeData = sanitize(cleanData);
        Object.assign(cleanData, safeData);

        // Usage Limit Check (Internal Only)
        let docSize = 0;
        if (!project.isExternal) {
            docSize = Buffer.byteLength(JSON.stringify(cleanData));
            if ((project.databaseUsed || 0) + docSize > project.databaseLimit) {
                return res.status(403).send("Database limit exceeded.");
            }
        }

        // Get Connection & Model
        const connection = await getConnection(project._id);
        const Model = getCompiledModel(connection, collectionConfig, project._id, project.isExternal);

        const result = await Model.create(cleanData);

        // Update Project Metadata (Internal Only)
        if (!project.isExternal) {
            project.databaseUsed = (project.databaseUsed || 0) + docSize;
            await project.save();
        }

        res.status(201).json(result);
    } catch (err) {
        console.error("Insert Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// 2. GET ALL DATA
module.exports.getAllData = async (req, res) => {
    try {
        const { collectionName } = req.params;
        const project = req.project;

        const collectionConfig = project.collections.find(c => c.name === collectionName);
        if (!collectionConfig) return res.status(404).json({ error: "Collection not found" });

        const connection = await getConnection(project._id);
        const Model = getCompiledModel(connection, collectionConfig, project._id, project.isExternal);

        const data = await Model.find({}).limit(100);
        res.json(data);
    } catch (err) {
        console.log("error----------------")
        res.status(500).json({ error: err.message });
    }
};

// 3. GET SINGLE DOC
module.exports.getSingleDoc = async (req, res) => {
    try {
        const { collectionName, id } = req.params;
        const project = req.project;

        const collectionConfig = project.collections.find(c => c.name === collectionName);
        if (!collectionConfig) return res.status(404).json({ error: "Collection not found" });

        const connection = await getConnection(project._id);
        const Model = getCompiledModel(connection, collectionConfig, project._id, project.isExternal);

        const doc = await Model.findById(id);
        if (!doc) return res.status(404).send("Document not found.");

        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. UPDATE DATA
module.exports.updateSingleData = async (req, res) => {
    try {
        const { collectionName, id } = req.params;
        const project = req.project;
        const incomingData = req.body;

        const collectionConfig = project.collections.find(c => c.name === collectionName);
        if (!collectionConfig) return res.status(404).json({ error: "Collection not found" });

        const connection = await getConnection(project._id);
        const Model = getCompiledModel(connection, collectionConfig, project._id, project.isExternal);

        // Basic Schema Validation
        const schemaRules = collectionConfig.model;
        for (const key in incomingData) {
            const fieldRule = schemaRules.find(f => f.key === key);
            if (!fieldRule) return res.status(400).send(`Field '${key}' not in schema.`);
            // Type checks... (Number, Boolean etc.)
        }

        const result = await Model.findByIdAndUpdate(id, { $set: incomingData }, { new: true });
        if (!result) return res.status(404).send("Document not found.");

        res.json({ message: "Updated", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. DELETE DATA
module.exports.deleteSingleDoc = async (req, res) => {
    try {
        const { collectionName, id } = req.params;
        const project = req.project;

        const collectionConfig = project.collections.find(c => c.name === collectionName);
        if (!collectionConfig) return res.status(404).json({ error: "Collection not found" });

        const connection = await getConnection(project._id);
        const Model = getCompiledModel(connection, collectionConfig, project._id, project.isExternal);

        const docToDelete = await Model.findById(id);
        if (!docToDelete) return res.status(404).send("Document not found.");

        let docSize = 0;
        if (!project.isExternal) {
            docSize = Buffer.byteLength(JSON.stringify(docToDelete));
        }

        await Model.deleteOne({ _id: id });

        if (!project.isExternal) {
            project.databaseUsed = Math.max(0, (project.databaseUsed || 0) - docSize);
            await project.save();
        }

        res.json({ message: "Document deleted", id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};