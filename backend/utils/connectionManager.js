const registry = new Map();
const Project = require("../models/Project");
const { decrypt } = require("./encryption");
const mongoose = require("mongoose");


async function getConnection(projectId) {
    if (registry.has(projectId)) {
        const cachedConn = registry.get(projectId);
        if (cachedConn.readyState === 1) {
            return cachedConn;
        }
    }

    const projectDoc = await Project.findById(projectId)
        .select("+externalConfig.iv +externalConfig.tag +externalConfig.encrypted");
    if (!projectDoc) throw new Error("Project not found");
    if (!projectDoc.isExternal) throw new Error("Project is not external");

    let config;
    try {
        const decryptedConfig = decrypt(projectDoc.externalConfig);
        config = JSON.parse(decryptedConfig);
    } catch {
        throw new Error("Invalid or corrupted external config");
    }

    const connection = mongoose.createConnection(config.dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    connection.on("connected", () => {
        console.log(`DB connected for project ${projectId}`);
    });

    connection.on("error", (err) => {
        console.error("Connection error:", err);
    });

    connection.on("close", () => {
        registry.delete(projectId);
        console.log(`DB connection closed for project ${projectId}`);
    });


    registry.set(projectId, connection);
    return connection;
}

module.exports = { getConnection };
