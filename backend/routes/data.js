const express = require('express');
const router = express.Router();
const verifyApiKey = require('../middleware/verifyApiKey');
const { insertData, getAllData, getSingleDoc, updateSingleData, deleteSingleDoc } = require("../controllers/data.controller")


// Dynamic POST Route
// Example: POST /api/data/products
router.post('/:collectionName', verifyApiKey, insertData);


// GET Route to fetch all data from a collection
// GET /api/data/products
router.get('/:collectionName', verifyApiKey, getAllData);


// GET Single Item by ID
// GET /api/data/products/69235c0cc8e73cd3d7bbeab8
router.get('/:collectionName/:id', verifyApiKey, getSingleDoc);


// DELETE Single Item by ID
// DELETE /api/data/products/69235c0cc8e73cd3d7bbeab8
router.delete('/:collectionName/:id', verifyApiKey, deleteSingleDoc);



// UPDATE Single Item by ID
// PUT /api/data/products/69235c0cc8e73cd3d7bbeab8
router.put('/:collectionName/:id', verifyApiKey, updateSingleData);


module.exports = router;