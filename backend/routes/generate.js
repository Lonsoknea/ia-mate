'use strict';

const express = require('express');
const router = express.Router();
const { generate } = require('../controllers/generateController');

// POST /api/generate
router.post('/', generate);

module.exports = router;
