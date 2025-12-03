const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


console.log(process.env.MONGO_URL);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        setTimeout(connectDB, 5000);
    }
};

mongoose.connection.on('error', (err) => {
    console.error("MongoDB Runtime Error:", err);
});

mongoose.connection.on('disconnected', () => {
    console.warn("MongoDB Disconnected. Retrying...");
    connectDB();
});

connectDB();


app.get('/', (req, res) => {
    res.send("listening")
})

const { limiter, logger } = require('./middleware/api_usage');
const verifyApiKey = require('./middleware/verifyApiKey');

// defining Routes
const authRoute = require('./routes/auth');
const projectRoute = require('./routes/projects');
const dataRoute = require('./routes/data');
const userAuthRoute = require('./routes/userAuth');
const storageRoute = require('./routes/storage');


// Using routes 
app.use('/api/', limiter);
app.use('/api/auth', authRoute);
app.use('/api/projects', projectRoute);

app.use('/api/userAuth', logger, userAuthRoute);

app.use('/api/data', verifyApiKey, logger, dataRoute);
app.use('/api/storage', verifyApiKey, logger, storageRoute);

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 1234;


const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// 🛡️ GRACEFUL SHUTDOWN (Fixed for Mongoose 8+)
const gracefulShutdown = async () => {
    console.log('🛑 SIGTERM/SIGINT received. Shutting down gracefully...');

    server.close(async () => {
        console.log('✅ HTTP server closed.');

        try {
            // Updated: No callback, use await instead
            await mongoose.connection.close(false);
            console.log('✅ MongoDB connection closed.');
            process.exit(0);
        } catch (err) {
            console.error('❌ Error closing MongoDB connection:', err);
            process.exit(1);
        }
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Force shutting down...');
        process.exit(1);
    }, 10000);
};

// Listen for termination signals (e.g., from PM2, Docker, or Ctrl+C)
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);