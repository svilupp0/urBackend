const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    key: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['String', 'Number', 'Boolean', 'Date']
    },
    required: { type: Boolean, default: false }
});

const collectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: [fieldSchema]
});

const externalConfigSchema = new mongoose.Schema({
    encrypted: { type: String, select: false },
    iv: { type: String, select: false },
    tag: { type: String, select: false }
}, { _id: false });


const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    jwtSecret: {
        type: String,
        required: true
    },
    collections: [collectionSchema],

    // STORAGE LIMITS (Files)
    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: 20 * 1024 * 1024 }, // 20MB for Files

    // DATABASE LIMITS (JSON Docs)
    databaseUsed: { type: Number, default: 0 }, // 
    databaseLimit: { type: Number, default: 20 * 1024 * 1024 }, // 20MB for Data

    externalConfig: {
        type: externalConfigSchema,
        default: null
    },

    isExternal: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);