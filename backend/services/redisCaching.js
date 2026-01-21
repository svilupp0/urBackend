const redis = require("../config/redis");

async function setProjectByApiKeyCache(api, project) {
    try {
        console.time("json");
        const data = JSON.stringify(project);
        console.timeEnd("json");
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
        console.time("json parse")
        const parsedData = JSON.parse(data)
        console.timeEnd("json parse")
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

module.exports = {
    setProjectByApiKeyCache,
    getProjectByApiKeyCache,
    deleteProjectByApiKeyCache
};
