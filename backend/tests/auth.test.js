const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Developer = require('../models/Developer');
const bcrypt = require('bcryptjs');
require('dotenv').config(); 

// --- SETUP ---
beforeAll(async () => {
    // Connect to the TEST Database
    const uri = process.env.TEST_MONGO_URL;
    if (!uri) {
        throw new Error("TEST_MONGO_URL not defined in .env");
    }

    // Disconnect any existing connection first
    await mongoose.disconnect();
    await mongoose.connect(uri);
});

afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.close();
});

// --- TESTS ---
describe('Auth API Security', () => {

    // Har test se pehle database saaf karein
    beforeEach(async () => {
        await Developer.deleteMany({}); // Clear old data

        // Create a dummy user
        const hashedPassword = await bcrypt.hash('password123', 10);
        await Developer.create({ email: 'test@example.com', password: hashedPassword });
    });

    // Har test ke baad bhi safai (Optional but good)
    afterEach(async () => {
        await Developer.deleteMany({});
    });

    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should BLOCK NoSQL Injection attempt (Zod Validation)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: { "$ne": null }, // 🚨 Attack Payload
                password: 'password123'
            });

        // --- 🔍 DEBUGGING LOGS ---
        console.log("Status Code:", res.statusCode);
        console.log("Response Body:", res.body);
        console.log("Response Text:", res.text);
        // -------------------------

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });
});