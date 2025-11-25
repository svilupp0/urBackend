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
    collections: [collectionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);