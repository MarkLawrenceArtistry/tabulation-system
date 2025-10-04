const express = require('express')
const multer = require('multer')
const router = express.Router()
const portionsController = require('../controllers/portionsController')

router.post('/', portionsController.createPortion)
router.get('/', portionsController.getAllPortions)
router.put('/:id/', portionsController.updatePortion)
router.delete('/:id/', portionsController.deletePortion)


module.exports = router