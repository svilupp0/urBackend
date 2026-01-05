const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv');
const app = express();
app.set('trust proxy', true);
const GC = require('./utils/GC');
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const adminWhitelist = ['http://localhost:5173', 'https://urbackend.bitbros.in'];

const adminCorsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || adminWhitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS for Admin access'));
        }
    },
    credentials: true
};


// IMPORTS 
const { limiter, logger } = require('./middleware/api_usage');

// Route Imports
const authRoute = require('./routes/auth');
const projectRoute = require('./routes/projects');
const dataRoute = require('./routes/data');
const userAuthRoute = require('./routes/userAuth');
const storageRoute = require('./routes/storage');

// ROUTES SETUP 
app.use('/api/', limiter); // Rate Limiter
app.use('/api/auth', authRoute); // Developer Auth
app.use('/api/projects', projectRoute); // Project Mgmt

// Logger added to userAuth route
app.use('/api/userAuth', logger, userAuthRoute);

// Data & Storage Routes (Protected)
app.use('/api/data', cors(adminCorsOptions), logger, dataRoute);
app.use('/api/storage', cors(adminCorsOptions), logger, storageRoute);

// Test Route
app.get('/', (req, res) => {
    res.status(200).json({ status: "success", message: "urBackend API is running 🚀" })
});

//  FAULT TOLERANCE: Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: "Invalid JSON format",
            message: "Check your request body syntax. Stray characters outside the JSON object are not allowed."
        });
    }

    console.error("🔥 Unhandled Error:", err.stack);
    res.status(500).json({
        error: "Something went wrong!",
        message: err.message
    });
});
//  DB CONNECTION & SERVER START 
// (Only connect if NOT in Test Mode)
if (process.env.NODE_ENV !== 'test') {

    const PORT = process.env.PORT || 1234;

    const connectDB = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log("✅ MongoDB Connected");
        } catch (err) {
            console.error("❌ MongoDB Connection Error:", err);
            // Retry logic
            setTimeout(connectDB, 5000);
        }
    };

    // Runtime Errors
    mongoose.connection.on('error', (err) => {
        console.error("🔥 MongoDB Runtime Error:", err);
    });

    // Auto-Reconnect
    mongoose.connection.on('disconnected', () => {
        console.warn("⚠️ MongoDB Disconnected. Retrying...");
        connectDB();
    });

    // Start DB & Server
    connectDB();
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    // 🛡️ GRACEFUL SHUTDOWN
    const gracefulShutdown = async () => {
        console.log('🛑 SIGTERM/SIGINT received. Shutting down gracefully...');

        server.close(async () => {
            console.log('✅ HTTP server closed.');
            try {
                await mongoose.connection.close(false);
                console.log('✅ MongoDB connection closed.');
                process.exit(0);
            } catch (err) {
                console.error('❌ Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });

        // Force close after 10s
        setTimeout(() => {
            console.error('Force shutting down...');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
}

// Export for Testing
module.exports = app;