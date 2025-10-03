
const express = require('express')
const cors = require('cors')

const PORT = 3000
const app = express()

app.use(express.json())
app.use(cors())

app.listen(PORT, () => {
    console.log(`The port is listening at https://localhost:${PORT}...`)
})

app.get('/', (req, res) => {
    res.status(200).json({success:true,data:"Welcome to our Tabulation System"})
})