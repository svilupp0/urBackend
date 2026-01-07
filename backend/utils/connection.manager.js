const { registry } = require("./registry");
const Project = require("../models/Project");
const { decrypt } = require("./encryption");
const mongoose = require("mongoose");


async function getConnection(projectId) {
    const key = projectId.toString();

    // 1. Registry Check
    if (registry.has(key)) {
        const cachedConn = registry.get(key);
        if (cachedConn.readyState === 1) {
            cachedConn.lastAccessed = new Date();
            return cachedConn;
        }
    }

    // 2. Fetch Project with HIDDEN fields
    const projectDoc = await Project.findById(projectId)
        .select("+resources.db.config.encrypted +resources.db.config.iv +resources.db.config.tag resources.db.isExternal");

    if (!projectDoc) throw new Error("Project not found");

    // 3. System DB fallback
    if (!projectDoc.resources.db.isExternal) {
        return mongoose.connection;
    }

    // 4. Decrypt logic
    let config;
    try {
        // Pura config object pass karo jisme encrypted, iv, aur tag ho
        const decryptedConfig = decrypt(projectDoc.resources.db.config);
        config = JSON.parse(decryptedConfig);
    } catch (err) {
        console.error("Decryption Error:", err);
        throw new Error("Invalid or corrupted external config");
    }

    // 5. Create Dynamic Connection
    const connection = mongoose.createConnection(config.dbUri);

    connection.on("connected", () => {
        console.log(`✅ External DB connected: ${projectId}`);
    });

    connection.on("error", (err) => {
        console.error(`❌ Connection error [${projectId}]:`, err);
        registry.delete(key); // Error hone par cache se hatao
    });

    connection.on("close", () => {
        registry.delete(key);
        console.log(`🔌 Connection closed: ${key}`);
    });

    connection.lastAccessed = new Date();
    registry.set(key, connection);

    return connection;
}

module.exports = { getConnection };
