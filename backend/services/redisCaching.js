const redis = require("../config/redis");

async function setProjectByApiKeyCache(api, project) {
    if (redis.status !== "ready") return;
    try {
        const data = JSON.stringify(project);
        await redis.set(
            `project:apikey:${api}`,
            data,
            'EX',
            60 * 60 * 2
        );
    } catch (err) {
        console.log(err);
    }
}

async function getProjectByApiKeyCache(api) {
    if (redis.status !== "ready") return null;
    try {
        const data = await redis.get(`project:apikey:${api}`);
        if (!data) return null;

        const parsedData = JSON.parse(data)
        return parsedData;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function deleteProjectByApiKeyCache(api) {
    if (redis.status !== "ready") return;
    try {
        await redis.del(`project:apikey:${api}`);
    } catch (err) {
        console.log(err);
    }
}


async function setProjectById(id, project) {
    if (redis.status !== "ready") return;
    try {
        const data = JSON.stringify(project);
        await redis.set(
            `project:id:${id}`,
            data,
            'EX',
            60 * 60 * 2
        );
    } catch (err) {
        console.log(err);
    }
}


async function getProjectById(id) {
    if (redis.status !== "ready") return null;
    try {
        const data = await redis.get(`project:id:${id}`);
        if (!data) return null;
        const parsedData = JSON.parse(data)
        return parsedData;
    } catch (err) {
        console.log(err);
        return null;
    }
}


async function deleteProjectById(id) {
    if (redis.status !== "ready") return;
    try {
        await redis.del(`project:id:${id}`);
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    setProjectByApiKeyCache,
    getProjectByApiKeyCache,
    deleteProjectByApiKeyCache,
    setProjectById,
    getProjectById,
    deleteProjectById
};
