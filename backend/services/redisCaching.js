const redis = require("../config/redis");

async function setProjectByApiKeyCache(api, project) {
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
    try {
        await redis.del(`project:apikey:${api}`);
    } catch (err) {
        console.log(err);
    }
}


async function setProjectById(id, project) {
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
