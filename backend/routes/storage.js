const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const verifyApiKey = require('../middleware/verifyApiKey');

// 1. Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 2. Configure Multer (Store file briefly in RAM)
// We use memoryStorage because we just need the buffer to send to Supabase immediately.
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB (Optional safety)
});

// UPLOAD ROUTE
// POST /api/storage/upload
// 'upload.single('file')' tells multer to look for a form field named 'file'
router.post('/upload', verifyApiKey, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send("No file uploaded. Make sure the form key is 'file'.");
        }

        const project = req.project;

        // 3. Generate a Unique Filename
        // Format: projectId/timestamp_originalName.jpg
        // This organizes files by project and prevents overwriting.
        const fileName = `${project._id}/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

        // 4. Upload to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from("dev-files") // The bucket name we created
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) throw error;

        // 5. Get the Public URL to view the file
        const { data: publicUrlData } = supabase
            .storage
            .from("dev-files")
            .getPublicUrl(fileName);

        // 6. Send success response with URL
        res.status(201).json({
            message: "File uploaded successfully",
            url: publicUrlData.publicUrl,
            path: fileName
        });

    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).send(err.message || "File upload failed");
    }
});

module.exports = router;