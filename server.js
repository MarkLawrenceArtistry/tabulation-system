
const express = require('express')
const cors = require('cors')
const { db, initDB } = require('./database')

const PORT = 3000
const app = express()
const candidateRoutes = require('./routes/candidates')
const authRoutes = require('./routes/auth')
const portionRoutes = require('./routes/portions')
const criteriaRoutes = require('./routes/criteria')
const scoresRoutes = require('./routes/scores')
const judgeRoutes = require('./routes/judges')
const resultsRoutes = require('./routes/results');

app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use('/api/candidates', candidateRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/portions', portionRoutes)
app.use('/api/criteria', criteriaRoutes)
app.use('/api/scores', scoresRoutes)
app.use('/api/judges', judgeRoutes)
app.use('/api/results', resultsRoutes)

initDB()

app.listen(PORT, () => {
    console.log(`The port is listening at localhost:${PORT}...`)
})

app.get('/', (req, res) => {
    res.status(200).json({success:true,data:"Welcome to our Tabulation System"})
})