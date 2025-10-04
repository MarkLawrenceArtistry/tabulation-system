const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');

router.get('/:portionId', resultsController.getResultsByPortion);

module.exports = router;