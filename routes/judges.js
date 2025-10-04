const express = require('express');
const router = express.Router();
const judgesController = require('../controllers/judgesController')

router.get('/:id/progress', judgesController.judgesState);

module.exports = router;