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
    // scrypt hashing: fast but brute focre resistant
    // 'salt' को .env में रखना बेहतर है
    const salt = process.env.API_KEY_SALT;

    // generate a derived key of 64 bytes
    return crypto.scryptSync(apikey, salt, 64).toString('hex');
}

module.exports = { generateApiKey, hashApiKey }