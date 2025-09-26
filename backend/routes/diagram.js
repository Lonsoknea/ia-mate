'use strict';

const express = require('express');
const router = express.Router();
const { diagram } = require('../controllers/diagramController');

// POST /api/diagram
router.post('/', diagram);

module.exports = router;
