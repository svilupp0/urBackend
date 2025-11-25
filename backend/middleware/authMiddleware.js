const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Poora header mangao
    const authHeader = req.header('Authorization');

    // 2. Check karo header hai ya nahi
    if (!authHeader) return res.status(401).send('Access Denied: No Token Provided');

    // 3. "Bearer " ko hatakar asli token nikalo
    // Hum space (' ') se split karte hain aur dusra hissa ([1]) uthate hain.
    const token = authHeader.split(' ')[1];

    // Agar split karne ke baad token nahi mila (matlab format galat tha)
    if (!token) return res.status(401).send('Access Denied: Malformed Token Format');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        console.log(err);
        // Error message mein 'err' object bhejna security risk ho sakta hai production mein, 
        // isliye sirf message bhejte hain.
        res.status(400).send('Invalid Token');
    }
};