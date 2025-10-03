const express = require('express')
const router = express.Router()
const candidatesControlller = require('../controllers/candidatesController')

router.post('/', candidatesControlller.createCandidate)

module.exports = router