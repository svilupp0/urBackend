const { registry } = require("./registry");
const Project = require("../models/Project");
const { decrypt } = require("./encryption");
const mongoose = require("mongoose");


async function getConnection(projectId) {
    const key = projectId.toString();

    if (registry.has(key)) {
        const cachedConn = registry.get(key);
        if (cachedConn.readyState === 1) {
            cachedConn.lastAccessed = new Date();
            return cachedConn;
        }
    }

    const projectDoc = await Project.findById(projectId)
        .select("+resources.db.config.encrypted +resources.db.config.iv +resources.db.config.tag resources.db.isExternal");

    if (!projectDoc) throw new Error("Project not found");

    if (!projectDoc.resources.db.isExternal) {
        return mongoose.connection;
    }

    let config;
    try {
        const decryptedConfig = decrypt(projectDoc.resources.db.config);
        config = JSON.parse(decryptedConfig);
    } catch (err) {
        console.error("Decryption Error:", err);
        throw new Error("Invalid or corrupted external config");
    }

    const connection = mongoose.createConnection(config.dbUri);

    connection.on("connected", () => {
        console.log(`✅ External DB connected: ${projectId}`);
    });

    connection.on("error", (err) => {
        console.error("❌ Connection error [%s]:", projectId, err);
        registry.delete(key); 
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
