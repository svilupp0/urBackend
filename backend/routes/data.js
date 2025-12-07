const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const verifyApiKey = require('../middleware/verifyApiKey');


//  sanitizer to remove keys starting with $
const sanitize = (obj) => {
    const clean = {};
    for (const key in obj) {
        if (!key.startsWith('$')) {
            clean[key] = obj[key];
        }
    }
    return clean;
};





// Dynamic POST Route
// Example: POST /api/data/products
router.post('/:collectionName', verifyApiKey, async (req, res) => {
    try {
        const { collectionName } = req.params;
        const project = req.project; // Middleware se aaya, lekin ye purana instance ho sakta hai

        // Latest Project Data fetch karein (taaki accurate usage mile)
        const currentProject = await Project.findById(project._id);

        const collectionConfig = currentProject.collections.find(c => c.name === collectionName);
        if (!collectionConfig) {
            return res.status(404).json({
                error: "Collection not found",
                collection: collectionName
            });
        }

        const schemaRules = collectionConfig.model;
        const incomingData = req.body;
        const cleanData = {};

        // --- VALIDATION & SANITIZATION ---
        for (const field of schemaRules) {
            if (field.required && incomingData[field.key] === undefined) {
                return res.status(400).json({
                    error: `Field '${field.key}' is required.`,
                    field: field.key
                });
            }
            if (incomingData[field.key] !== undefined) {
                // Type checking logic (same as before)...
                if (field.type === 'Number' && typeof incomingData[field.key] !== 'number') return res.status(400).send(`Field '${field.key}' must be a Number.`);
                if (field.type === 'Boolean' && typeof incomingData[field.key] !== 'boolean') return res.status(400).send(`Field '${field.key}' must be a Boolean.`);

                cleanData[field.key] = incomingData[field.key];
            }
        }

        const safeData = sanitize(cleanData);
        cleanData = safeData;

        // --- NEW: CHECK DB LIMIT ---
        // Calculate approx size in bytes
        const docSize = Buffer.byteLength(JSON.stringify(cleanData));

        if (currentProject.databaseUsed + docSize > currentProject.databaseLimit) {
            return res.status(403).send("Database limit exceeded. Delete some data to free up space.");
        }

        // Insert Data
        const finalCollectionName = `${project._id}_${collectionName}`;
        const collection = mongoose.connection.db.collection(finalCollectionName);
        const result = await collection.insertOne(cleanData);

        // --- NEW: UPDATE USAGE ---
        currentProject.databaseUsed += docSize;
        await currentProject.save();

        res.status(201).json({
            message: "Data inserted successfully",
            insertedId: result.insertedId,
            data: cleanData
        });

    } catch (err) {
        console.log(err)
        res.status(500).send('Some issue at our end');
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
            return res.status(404).json({
                error: "Collection not found",
                collection: collectionName
            });
        }
        const finalCollectionName = `${project._id}_${collectionName}`;

        const data = await mongoose.connection.db
            .collection(finalCollectionName)
            .find({})
            .toArray();

        res.json(data);

    } catch (err) {
        console.log(err)
        res.status(500).send('Some issue at our end');
    }
});


// GET Single Item by ID
// Example: GET /api/data/products/69235c0cc8e73cd3d7bbeab8
router.get('/:collectionName/:id', verifyApiKey, async (req, res) => {
    try {
        const { collectionName, id } = req.params;
        const project = req.project;

        // Security Check
        const collectionConfig = project.collections.find(c => c.name === collectionName);
        if (!collectionConfig) {
            return res.status(404).json({
                error: "Collection not found",
                collection: collectionName
            });
        }

        const finalCollectionName = `${project._id}_${collectionName}`;

        // Find document by _id
        const doc = await mongoose.connection.db
            .collection(finalCollectionName)
            .findOne({ _id: new ObjectId(id) }); // ID convert karna zaroori hai

        if (!doc) {
            return res.status(404).send("Document not found.");
        }

        res.json(doc);

    } catch (err) {
        console.log(err)
        res.status(500).send('Some issue at our end');
    }
});


// DELETE Single Item by ID
// Example: DELETE /api/data/products/69235c0cc8e73cd3d7bbeab8
router.delete('/:collectionName/:id', verifyApiKey, async (req, res) => {
    try {
        const { collectionName, id } = req.params;
        const project = req.project;

        // Latest Project Fetch
        const currentProject = await Project.findById(project._id);

        const finalCollectionName = `${project._id}_${collectionName}`;
        const collection = mongoose.connection.db.collection(finalCollectionName);

        // Pehle document dhoondo taaki size pata chale
        const docToDelete = await collection.findOne({ _id: new ObjectId(id) });

        if (!docToDelete) return res.status(404).send("Document not found.");

        // Calculate size to subtract
        // Note: _id field bhi count hota hai, approx size le rahe hain
        const docSize = Buffer.byteLength(JSON.stringify(docToDelete));

        // Delete
        await collection.deleteOne({ _id: new ObjectId(id) });

        // Update Usage (Ensure it doesn't go below 0)
        currentProject.databaseUsed = Math.max(0, currentProject.databaseUsed - docSize);
        await currentProject.save();

        res.json({ message: "Document deleted", id });

    } catch (err) {
        console.log(err)
        res.status(500).send('Some issue at our end');
    }
});



// UPDATE Single Item by ID
// Example: PUT /api/data/products/69235c0cc8e73cd3d7bbeab8
router.put('/:collectionName/:id', verifyApiKey, async (req, res) => {
    try {
        const { collectionName, id } = req.params;
        const project = req.project;
        const incomingData = req.body; // Naya data

        // Security & Config Find
        const collectionConfig = project.collections.find(c => c.name === collectionName);
        if (!collectionConfig) {
            return res.status(404).json({
                error: "Collection not found",
                collection: collectionName
            });
        }
        // --- VALIDATION REPEAT (Zaroori hai) ---
        const schemaRules = collectionConfig.model;
        for (const key in incomingData) {
            // 1. Check if field exists in schema
            const fieldRule = schemaRules.find(f => f.key === key);
            if (!fieldRule) {
                // Optional: Aap chaho toh error de sakte ho agar unknown field aaye
                // Abhi ke liye ignore karte hain ya error dete hain. Let's error for strictness.
                return res.status(400).send(`Field '${key}' is not defined in the schema.`);
            }

            // 2. Check Type
            if (fieldRule.type === 'Number' && typeof incomingData[key] !== 'number') {
                return res.status(400).send(`Field '${key}' must be a Number.`);
            }
            if (fieldRule.type === 'Boolean' && typeof incomingData[key] !== 'boolean') {
                return res.status(400).send(`Field '${key}' must be a Boolean.`);
            }
            // String check is loose in JS, usually fine.
        }


        const safeData = sanitize(incomingData);
        incomingData = safeData;


        const finalCollectionName = `${project._id}_${collectionName}`;

        const result = await mongoose.connection.db
            .collection(finalCollectionName)
            .updateOne(
                { _id: new ObjectId(id) }, // Kisko update karna hai
                { $set: incomingData }     // Kya update karna hai ($set zaroori hai)
            );

        if (result.matchedCount === 0) {
            return res.status(404).send("Document not found to update.");
        }

        res.json({ message: "Document updated successfully", id, updatedFields: incomingData });

    } catch (err) {
        console.log(err)
        res.status(500).send('Some issue at our end');
    }
});


module.exports = router;