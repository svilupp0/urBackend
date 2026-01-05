const registry = require("./registry");
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
        .select("+externalConfig.iv +externalConfig.tag +externalConfig.encrypted");
    if (!projectDoc) throw new Error("Project not found");
    if (!projectDoc.isExternal) {
        return mongoose.connection;
    }

    let config;
    try {
        const decryptedConfig = decrypt(projectDoc.externalConfig);
        config = JSON.parse(decryptedConfig);
    } catch {
        throw new Error("Invalid or corrupted external config");
    }

    const connection = mongoose.createConnection(config.dbUri);

    connection.on("connected", () => {
        console.log(`DB connected for project ${projectId}`);
    });

    connection.on("error", (err) => {
        console.error("Connection error:", err);
    });

    connection.on("close", () => {
        registry.delete(key);
        console.log(`DB connection closed for project ${key}`);
    });


    connection.lastAccessed = new Date();
    registry.set(key, connection);

    return connection;
}

module.exports = { getConnection };
