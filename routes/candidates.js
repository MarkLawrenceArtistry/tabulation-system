const express = require('express')
const multer = require('multer')
const router = express.Router()
const candidatesControlller = require('../controllers/candidatesController')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', upload.single('image'), candidatesControlller.createCandidate)

module.exports = router