const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const verifyApiKey = require('../middleware/verifyApiKey');

// 1. Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 2. Configure Multer (Store file briefly in RAM)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

// --- ROUTES ---

// 1. UPLOAD FILE
router.post('/upload', verifyApiKey, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).send("No file uploaded.");

        const project = req.project;
        const fileName = `${project._id}/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

        const { data, error } = await supabase.storage
            .from("dev-files")
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
            .from("dev-files")
            .getPublicUrl(fileName);

        res.status(201).json({
            message: "File uploaded successfully",
            url: publicUrlData.publicUrl,
            path: fileName
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 2. DELETE SINGLE FILE (New)
router.delete('/file', verifyApiKey, async (req, res) => {
    try {
        const { path } = req.body; // Full path like "projectId/filename.jpg"
        const project = req.project;

        if (!path) return res.status(400).send("File path is required.");

        // Security Check: Only allow deleting files belonging to this project
        if (!path.startsWith(`${project._id}/`)) {
            return res.status(403).send("Access denied. You can only delete your own project files.");
        }

        const { error } = await supabase.storage.from('dev-files').remove([path]);
        if (error) throw error;

        res.json({ message: "File deleted successfully" });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 3. DELETE ALL FILES (New)
router.delete('/all', verifyApiKey, async (req, res) => {
    try {
        const project = req.project;
        const projectId = project._id.toString();

        let deletedCount = 0;
        let hasMore = true;

        // Loop to delete all files (Supabase pagination limit)
        while (hasMore) {
            const { data: files, error } = await supabase.storage
                .from('dev-files')
                .list(projectId, { limit: 100 });

            if (error) throw error;

            if (files && files.length > 0) {
                const paths = files.map(f => `${projectId}/${f.name}`);
                const { error: delError } = await supabase.storage
                    .from('dev-files')
                    .remove(paths);

                if (delError) throw delError;
                deletedCount += files.length;
            } else {
                hasMore = false;
            }
        }

        res.json({ message: `All files deleted. Total removed: ${deletedCount}` });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;