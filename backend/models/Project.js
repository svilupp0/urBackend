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
    storageUsed: { type: Number, default: 0 }, // in bytes
    storageLimit: { type: Number, default: 100 * 1024 * 1024 }, // 100MB for Files

    // DATABASE LIMITS (JSON Docs)
    databaseUsed: { type: Number, default: 0 }, // in bytes
    databaseLimit: { type: Number, default: 50 * 1024 * 1024 } // 50MB for Data (approx 50,000 large docs)

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);