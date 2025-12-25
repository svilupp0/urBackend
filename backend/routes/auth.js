const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const authorization = require('../middleware/authMiddleware');
const Developer = require('../models/Developer');
const Project = require('../models/Project');
const otpSchema = require('../models/otp');
const sendOtp = require('../utils/emailService');

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

// REGISTER ROUTE
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

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const dev = await Developer.findOne({ email });
        if (!dev) return res.status(400).json({ error: "User not found" });

        const validPass = await bcrypt.compare(password, dev.password);
        if (!validPass) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ _id: dev._id, isVerified: dev.isVerified }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.log("🔥 LOGIN ERROR CAUGHT:", err.message);
        console.log("Is ZodError?", err instanceof z.ZodError);

        if (err instanceof z.ZodError) {
            return res.status(400).json({
                error: "Validation Failed",
                details: err.issues
            });
        }

        console.error("Server Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CHANGE PASSWORD (Protected)
router.put('/change-password', authorization, async (req, res) => {
    try {
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

// DELETE ACCOUNT (Protected - Danger Zone)
router.delete('/delete-account', authorization, async (req, res) => {
    try {
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

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const existingUser = await Developer.findOne({ email });
        if (!existingUser) return res.status(400).json({ error: "User not found" });

        if (existingUser.isVerified) return res.status(400).json({ error: "User already verified" });

        const existingOtp = await otpSchema.findOne({ email });
        if (existingOtp) {
            await existingOtp.remove();
        }
        const newOtp = new otpSchema(
            {
                userId: existingUser._id,
                otp
            });
        newOtp.save();
        await sendOtp(email, otp);
        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const existingUser = await Developer.findOne({ email }).sort({ createdAt: -1 });
        if (!existingUser) return res.status(400).json({ error: "User not found" });

        const existingOtp = await otpSchema.findOne({ userId: existingUser._id });
        if (!existingOtp) return res.status(400).json({ error: "You havn't requested an OTP" });

        console.log(existingOtp.otp);
        console.log(otp);
        if (existingOtp.otp !== otp) return res.status(400).json({ error: "Incorrect OTP" });

        await existingOtp.deleteOne();
        existingUser.isVerified = true;
        await existingUser.save();

        // Generate new token with isVerified: true
        const token = jwt.sign({ _id: existingUser._id, isVerified: existingUser.isVerified }, process.env.JWT_SECRET);

        res.status(200).json({ message: "OTP verified successfully", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;