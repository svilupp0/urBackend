const rateLimit = require('express-rate-limit');
const Log = require('../models/Log');

// 1. Rate Limiter (Same as before)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. Logger (UPDATED ✅)
const logger = (req, res, next) => {
    // CHANGE: Use 'req.originalUrl' instead of 'req.path'
    if (req.originalUrl.startsWith('/api/data') || req.originalUrl.startsWith('/api/storage')) {

        res.on('finish', async () => {
            // verifyApiKey middleware se 'req.project' set hona zaroori hai
            if (req.project) {
                try {
                    await Log.create({
                        projectId: req.project._id,
                        method: req.method,
                        path: req.originalUrl, // Save full path
                        status: res.statusCode,
                        ip: req.ip
                    });
                    // Console log for debugging
                    console.log(`📝 Logged: ${req.method} ${req.originalUrl} (${res.statusCode})`);
                } catch (e) {
                    console.error("Logging failed:", e.message);
                }
            } else {
                console.log("⚠️ Logger skipped: No project found in request (Check verifyApiKey order)");
            }
        });
    }
    next();
};

module.exports = { limiter, logger };