const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const authorization = require('../middleware/authMiddleware');
const Developer = require('../models/Developer');
const Project = require('../models/Project');

// --- SCHEMAS ---
const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters")
});

const deleteAccountSchema = z.object({
    password: z.string().min(1, "Password is required")
});

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        // Validate with Zod
        const { email, password } = loginSchema.parse(req.body);

        const existingUser = await Developer.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDev = new Developer({ email, password: hashedPassword });
        await newDev.save();

        res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const dev = await Developer.findOne({ email });
        if (!dev) return res.status(400).json({ error: "User not found" });

        const validPass = await bcrypt.compare(password, dev.password);
        if (!validPass) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ _id: dev._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.log("🔥 LOGIN ERROR CAUGHT:", err.message);
        console.log("Is ZodError?", err instanceof z.ZodError);

        if (err instanceof z.ZodError) {
            // Error ko simple banakar bhejte hain check karne ke liye
            return res.status(400).json({
                error: "Validation Failed",
                details: err.issues // Zod v3.x uses .issues sometimes, check .errors too
            });
        }

        console.error("Server Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 3. CHANGE PASSWORD (Protected)
router.put('/change-password', authorization, async (req, res) => {
    try {
        // 🛡️ FIX: Validate inputs here too!
        const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

        const dev = await Developer.findById(req.user._id);

        const validPass = await bcrypt.compare(currentPassword, dev.password);
        if (!validPass) return res.status(400).json({ error: "Incorrect current password" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        dev.password = hashedPassword;
        await dev.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 4. DELETE ACCOUNT (Protected - Danger Zone)
router.delete('/delete-account', authorization, async (req, res) => {
    try {
        // 🛡️ FIX: Validate input here too!
        const { password } = deleteAccountSchema.parse(req.body);

        const dev = await Developer.findById(req.user._id);

        const validPass = await bcrypt.compare(password, dev.password);
        if (!validPass) return res.status(400).json({ error: "Incorrect password. Cannot delete account." });

        await Project.deleteMany({ owner: req.user._id });
        await Developer.findByIdAndDelete(req.user._id);

        res.json({ message: "Account and all projects deleted." });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;