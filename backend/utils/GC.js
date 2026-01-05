const registry = require("./registry");
function garbageCollect() {
    setInterval(() => {
        console.log("20 minutes passed");
        const now = new Date();
        for (const [key, value] of registry) {
            if (now - value.lastAccessed > 20 * 60 * 1000) {

                if (value.readyState === 1) {
                    value.close();
                    registry.delete(key);
                }

            }
        }
    }, 20 * 60 * 1000);
}

garbageCollect();

module.exports = garbageCollect;
