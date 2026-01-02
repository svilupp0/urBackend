const express = require('express');
const router = express.Router();
const verifyApiKey = require('../middleware/verifyApiKey');
const { signup, login, me } = require('../controllers/userAuth.controller');

// SIGNUP ROUTE
router.post('/signup', verifyApiKey, signup);

// LOGIN ROUTE
router.post('/login', verifyApiKey, login);

// GET CURRENT USER
router.get('/me', verifyApiKey, me);

module.exports = router;