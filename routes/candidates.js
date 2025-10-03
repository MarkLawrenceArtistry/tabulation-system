const express = require('express')
const multer = require('multer')
const router = express.Router()
const candidatesControlller = require('../controllers/candidatesController')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', upload.single('image'), candidatesControlller.createCandidate)
router.get('/', candidatesControlller.getAllCandidates)

router.get('/:id/image', candidatesControlller.getCandidateImage)

router.put('/:id/', upload.single('image'), candidatesControlller.updateCandidate)
router.delete('/:id/', candidatesControlller.deleteCandidate)


module.exports = router