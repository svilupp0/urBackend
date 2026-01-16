const redis = require("../config/redis");

async function setProjectByApiKeyCache(api, project) {
    try {
        await redis.set(
            `project:apikey:${api}`,
            JSON.stringify(project),
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
        return JSON.parse(data);
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

module.exports = {
    setProjectByApiKeyCache,
    getProjectByApiKeyCache,
    deleteProjectByApiKeyCache
};
