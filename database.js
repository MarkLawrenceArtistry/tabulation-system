const sqlite3 = require('sqlite3')
const DB_SOURCE = 'tabulation.db'

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if(err) {
        console.log(err.message)
    }
})

const initDB = () => {
    db.serialize(() => {
        const candidates = `
            CREATE TABLE IF NOT EXISTS candidates (
                id INTEGER PRIMARY KEY,
                full_name TEXT NOT NULL,
                course TEXT NOT NULL,
                section TEXT NOT NULL,
                school TEXT NOT NULL,
                category TEXT NOT NULL,
                image BLOB
            )
        `

        db.run(candidates, (err) => {
            if(err) {
                console.log("ERROR CREATING candidates TABLE: " + err.message)
            } else {
                console.log("candidates TABLE CREATED/ALREADY EXISTS.")
            }
        })
    })
}

module.exports = { db, initDB }