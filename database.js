const sqlite3 = require('sqlite3')
const DB_SOURCE = 'tabulation.db'

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if(err) {
        console.log(err.message)
    }
})

const initDB = () => {
    db.serialize(() => {
        const events = `
            CREATE TABLE events (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                date TEXT
            )
        `

        const candidates = `
            CREATE TABLE IF NOT EXISTS candidates (
                id INTEGER PRIMARY KEY,
                event_id INTEGER NOT NULL,
                full_name TEXT NOT NULL,
                course TEXT NOT NULL,
                section TEXT NOT NULL,
                school TEXT NOT NULL,
                category TEXT NOT NULL,
                image BLOB,
                FOREIGN KEY (event_id) REFERENCES events (id)
            )
        `

        const users = `
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL -- 'admin' or 'judge'
            );
        `

        const portions = `
            CREATE TABLE portions (
                id INTEGER PRIMARY KEY,
                event_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'open',
                FOREIGN KEY (event_id) REFERENCES events (id)
            );
        `

        const criteria = `
            CREATE TABLE criteria (
                id INTEGER PRIMARY KEY,
                portion_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                max_score INTEGER NOT NULL,
                FOREIGN KEY (portion_id) REFERENCES portions (id)
            );
        `

        const scores = `
            CREATE TABLE scores (
                id INTEGER PRIMARY KEY,
                judge_id INTEGER NOT NULL,
                candidate_id INTEGER NOT NULL,
                criterion_id INTEGER NOT NULL,
                score REAL NOT NULL,
                FOREIGN KEY (judge_id) REFERENCES users (id),
                FOREIGN KEY (candidate_id) REFERENCES candidates (id),
                FOREIGN KEY (criterion_id) REFERENCES criteria (id),
                UNIQUE(judge_id, candidate_id, criterion_id)
            );
        `

        db.run(events, (err) => {
            if(err) {
                console.log("ERROR CREATING events TABLE: " + err.message)
            } else {
                console.log("events TABLE CREATED/ALREADY EXISTS.")
            }
        })

        db.run(candidates, (err) => {
            if(err) {
                console.log("ERROR CREATING candidates TABLE: " + err.message)
            } else {
                console.log("candidates TABLE CREATED/ALREADY EXISTS.")
            }
        })

        db.run(users, (err) => {
            if(err) {
                console.log("ERROR CREATING users TABLE: " + err.message)
            } else {
                console.log("users TABLE CREATED/ALREADY EXISTS.")
            }
        })

        db.run(portions, (err) => {
            if(err) {
                console.log("ERROR CREATING portions TABLE: " + err.message)
            } else {
                console.log("portions TABLE CREATED/ALREADY EXISTS.")
            }
        })

        db.run(criteria, (err) => {
            if(err) {
                console.log("ERROR CREATING criteria TABLE: " + err.message)
            } else {
                console.log("criteria TABLE CREATED/ALREADY EXISTS.")
            }
        })

        db.run(scores, (err) => {
            if(err) {
                console.log("ERROR CREATING scores TABLE: " + err.message)
            } else {
                console.log("scores TABLE CREATED/ALREADY EXISTS.")
            }
        })
    })
}

module.exports = { db, initDB }