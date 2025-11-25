const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyApiKey = require('../middleware/verifyApiKey');

// Dynamic POST Route
// Example: POST /api/data/products
router.post('/:collectionName', verifyApiKey, async (req, res) => {
    try {
        const { collectionName } = req.params;
        const project = req.project; // Middleware se mila project data

        // 1. Find Collection Config
        const collectionConfig = project.collections.find(c => c.name === collectionName);

        if (!collectionConfig) {
            return res.status(404).send(`Collection '${collectionName}' not found in this project.`);
        }

        // 2. VALIDATION LOOP (The Magic Engine) 🕵️‍♂️
        // Hum check karenge ki incoming data schema se match karta hai ya nahi
        const schemaRules = collectionConfig.model;
        const incomingData = req.body;

        for (const field of schemaRules) {
            // A. Check Required Fields
            if (field.required && incomingData[field.key] === undefined) {
                return res.status(400).send(`Field '${field.key}' is required.`);
            }

            // B. Check Data Types (Basic Validation)
            if (incomingData[field.key] !== undefined) {
                // Agar schema ne kaha "Number" aur data aaya kuch aur
                if (field.type === 'Number' && typeof incomingData[field.key] !== 'number') {
                    return res.status(400).send(`Field '${field.key}' must be a Number.`);
                }
                if (field.type === 'Boolean' && typeof incomingData[field.key] !== 'boolean') {
                    return res.status(400).send(`Field '${field.key}' must be a Boolean.`);
                }
            }
        }

        // 3. Insert Data into MongoDB 💾
        // Hum Mongoose Model nahi, seedha DB driver use kar rahe hain taaki dynamic ho sake
        // Collection ka naam unique banayenge: projectId_collectionName
        const finalCollectionName = `${project._id}_${collectionName}`;

        const result = await mongoose.connection.db
            .collection(finalCollectionName)
            .insertOne(incomingData);

        res.status(201).json({
            message: "Data inserted successfully",
            insertedId: result.insertedId,
            data: incomingData
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});


// GET Route to fetch all data from a collection
// Example: GET /api/data/products
router.get('/:collectionName', verifyApiKey, async (req, res) => {
    try {
        const { collectionName } = req.params;
        const project = req.project;

        const collectionConfig = project.collections.find(c => c.name === collectionName);
        if (!collectionConfig) {
            return res.status(404).send(`Collection '${collectionName}' not found.`);
        }
        const finalCollectionName = `${project._id}_${collectionName}`;

        const data = await mongoose.connection.db
            .collection(finalCollectionName)
            .find({})
            .toArray();

        res.json(data);

    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports = router;