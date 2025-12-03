const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const authorization = require('../middleware/authMiddleware'); // Middleware
const Developer = require('../models/Developer');
const Project = require('../models/Project');
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {

        const { email, password } = loginSchema.parse(req.body);

        const existingUser = await Developer.findOne({ email });
        if (existingUser) return res.status(400).send("Email already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDev = new Developer({ email, password: hashedPassword });
        await newDev.save();
        res.status(201).send("Registered successfully");
    } catch (err) {

        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }

        console.log(err);
        res.status(500).send('Some issue at our end');
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const dev = await Developer.findOne({ email });
        if (!dev) return res.status(400).send("User not found");

        const validPass = await bcrypt.compare(password, dev.password);
        if (!validPass) return res.status(400).send("Invalid password");

        const token = jwt.sign({ _id: dev._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        console.log(err);
        res.status(500).send('Some issue at our end');
    }
});

// 3. CHANGE PASSWORD (Protected)
router.put('/change-password', authorization, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const dev = await Developer.findById(req.user._id);

        // Check old password
        const validPass = await bcrypt.compare(currentPassword, dev.password);
        if (!validPass) return res.status(400).send("Incorrect current password");

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        dev.password = hashedPassword;
        await dev.save();

        res.send("Password updated successfully");
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        console.log(err);
        res.status(500).send('Some issue at our end');
    }
});

// 4. DELETE ACCOUNT (Protected - Danger Zone)
router.delete('/delete-account', authorization, async (req, res) => {
    try {
        const { password } = req.body; // Confirmation ke liye password chahiye
        const dev = await Developer.findById(req.user._id);

        const validPass = await bcrypt.compare(password, dev.password);
        if (!validPass) return res.status(400).send("Incorrect password. Cannot delete account.");

        // 1. Delete all projects owned by dev
        await Project.deleteMany({ owner: req.user._id });

        // 2. Delete developer
        await Developer.findByIdAndDelete(req.user._id);

        res.send("Account and all projects deleted.");
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        console.log(err);
        res.status(500).send('Some issue at our end');
    }
});

module.exports = router;