const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authorization = require('../middleware/authMiddleware');
const Developer = require('../models/Developer');

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await Developer.findOne({ email });
        if (existingUser) return res.status(400).send("Email already exists");

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new developer
        const newDev = new Developer({
            email,
            password: hashedPassword
        });

        await newDev.save();
        res.status(201).send("Registered successfully");

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const dev = await Developer.findOne({ email });
        if (!dev) return res.status(400).send("User not found");

        // Check password
        const validPass = await bcrypt.compare(password, dev.password);
        if (!validPass) return res.status(400).send("Invalid password");

        // Generate Token
        // Make sure JWT_SECRET is in your .env file
        const token = jwt.sign({ _id: dev._id }, process.env.JWT_SECRET);

        res.json({ token });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/protected', authorization, (req, res) => {
    console.log(req.user)
    res.send("Protected route");
});

module.exports = router;