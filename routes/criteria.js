const express = require('express')
const router = express.Router()
const criteriaController = require('../controllers/criteriaController')

router.post('/', criteriaController.createCriteria)
router.get('/', criteriaController.getAllCriterias)
router.get('/:id/', criteriaController.getCriteria)
router.put('/:id/', criteriaController.updateCriteria)
router.delete('/:id/', criteriaController.deleteCriteria)

module.exports = router