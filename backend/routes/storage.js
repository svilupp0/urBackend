const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const verifyApiKey = require('../middleware/verifyApiKey');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

// 1. UPLOAD FILE
router.post('/upload', verifyApiKey, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded." });

        const project = req.project;

        if (project.storageUsed + file.size > project.storageLimit) {
            return res.status(403).json({ error: "Storage limit exceeded. Upgrade plan or delete files." });
        }

        const fileName = `${project._id}/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

        const { data, error } = await supabase.storage
            .from("dev-files")
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (error) throw error;

        project.storageUsed += file.size;
        await project.save();

        const { data: publicUrlData } = supabase.storage
            .from("dev-files")
            .getPublicUrl(fileName);

        res.status(201).json({
            message: "File uploaded successfully",
            url: publicUrlData.publicUrl,
            path: fileName
        });

    } catch (err) {
        res.status(500).json({ error: err.message }); // Fixed
    }
});

// 2. DELETE SINGLE FILE
router.delete('/file', verifyApiKey, async (req, res) => {
    try {
        const { path } = req.body;
        const project = req.project;

        if (!path) return res.status(400).json({ error: "File path is required." });

        if (!path.startsWith(`${project._id}/`)) {
            return res.status(403).json({ error: "Access denied. You can only delete your own project files." });
        }

        const { error } = await supabase.storage.from('dev-files').remove([path]);
        if (error) throw error;

        res.json({ message: "File deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message }); // Fixed
    }
});

// 3. DELETE ALL FILES
router.delete('/all', verifyApiKey, async (req, res) => {
    try {
        const project = req.project;
        const projectId = project._id.toString();

        let deletedCount = 0;
        let hasMore = true;

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
        res.status(500).json({ error: err.message }); // Fixed
    }
});

module.exports = router;