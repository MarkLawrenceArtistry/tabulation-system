
const express = require('express')
const cors = require('cors')
const { db, initDB } = require('./database')

const PORT = 3000
const app = express()
const candidateRoutes = require('./routes/candidates')
const authRoutes = require('./routes/auth')

app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use('/api/candidates', candidateRoutes)
app.use('/api/auth', authRoutes)
initDB()

app.listen(PORT, () => {
    console.log(`The port is listening at localhost:${PORT}...`)
})

app.get('/', (req, res) => {
    res.status(200).json({success:true,data:"Welcome to our Tabulation System"})
})