const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyApiKey = require('../middleware/verifyApiKey');
const { uploadFile, deleteFile, deleteAllFiles } = require("../controllers/storage.controller")

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB Limit
});

// UPLOAD FILE
router.post('/upload', verifyApiKey, upload.single('file'), uploadFile);

// DELETE SINGLE FILE
router.delete('/file', verifyApiKey, deleteFile);

// DELETE ALL FILES
router.delete('/all', verifyApiKey, deleteAllFiles);

module.exports = router;