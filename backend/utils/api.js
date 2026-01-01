const crypto = require('crypto');

function generateApiKey() {

    // OS level cryptographic randomnesss
    const bytes = crypto.randomBytes(32)
    // console.log(bytes);

    const key = bytes.toString("base64url");
    // console.log(key)

    return `ub_key_${key}`

}

//api hashing
function hashApiKey(apikey) {
    return crypto
        .createHmac("sha256", "ikewdxnuuencwoi")
        .update(apikey)
        .digest("hex");
}

module.exports = { generateApiKey, hashApiKey }