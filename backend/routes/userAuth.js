const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyApiKey = require('../middleware/verifyApiKey');

// 1. SIGNUP ROUTE for End-Users
// POST /api/users/signup
router.post('/signup', verifyApiKey, async (req, res) => {
    try {
        const project = req.project;
        const { email, password, ...otherData } = req.body; // Baki data (name, age) ko alag kiya

        // Validation
        if (!email || !password) {
            return res.status(400).send("Email and Password are required.");
        }

        // Collection Name Construction
        // Hum forcefully "users" collection hi use karenge auth ke liye
        const collectionName = `${project._id}_users`;
        const collection = mongoose.connection.db.collection(collectionName);

        // 1. Check if user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists with this email.");
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save User
        const newUser = {
            email,
            password: hashedPassword, // Secured Password
            ...otherData, // Name, Age, etc.
            createdAt: new Date()
        };

        const result = await collection.insertOne(newUser);

        // 4. Generate Token (User ke liye)
        const token = jwt.sign(
            {
                userId: result.insertedId,
                projectId: project._id
            },
            project.jwtSecret
        );

        res.status(201).json({
            message: "User registered successfully",
            token: token,
            userId: result.insertedId
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});


// 2. LOGIN ROUTE for End-Users
// POST /api/users/login
router.post('/login', verifyApiKey, async (req, res) => {
    try {
        const project = req.project; // Middleware se mila
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send("Email and password required");

        const collectionName = `${project._id}_users`;
        const collection = mongoose.connection.db.collection(collectionName);

        const user = await collection.findOne({ email });
        if (!user) return res.status(400).send("Invalid email or password");

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).send("Invalid email or password");

        const token = jwt.sign(
            { userId: user._id, projectId: project._id },
            project.jwtSecret
        );

        res.json({ token });

    } catch (err) {
        res.status(500).send(err.message);
    }
});


// 3. GET CURRENT USER (Verify Token & Get Details)
// GET /api/users/me
router.get('/me', verifyApiKey, async (req, res) => {
    try {
        const project = req.project; // API Key se mila

        const tokenHeader = req.header('Authorization');
        if (!tokenHeader) return res.status(401).send("Access Denied: No Token Provided");

        const token = tokenHeader.replace("Bearer ", "");

        try {
            const decoded = jwt.verify(token, project.jwtSecret);

            const collectionName = `${project._id}_users`;
            const collection = mongoose.connection.db.collection(collectionName);

            const user = await collection.findOne({
                _id: new mongoose.Types.ObjectId(decoded.userId)
            });

            if (!user) return res.status(404).send("User not found");

            const { password, ...userData } = user;
            res.json(userData);

        } catch (err) {
            return res.status(400).send("Invalid or Expired Token");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});




module.exports = router;