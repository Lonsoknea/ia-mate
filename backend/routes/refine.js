'use strict';

const express = require('express');
const router = express.Router();
const { refine } = require('../controllers/refineController');

// POST /api/refine
router.post('/', refine);

module.exports = router;
