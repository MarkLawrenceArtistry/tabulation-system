const { db } = require('../database')

// for POST 
const createPortion = (req, res) => {
    const { name, status } = req.body

    const query = `
        INSERT INTO candidates (name, status)
        VALUES (?, ?)
    `
    const params = [name, status]

    db.run(query, params, function(err) {
        if(err) {
            res.status(500).json({success:false,data:err.message})
        } else {
            res.status(201).json({success:true,data:{
                id: this.lastID,
                name: name,
                status: status
            }})
        }
    })
}

// for GET
const getAllPortions = (req, res) => {
    const query = `
        SELECT * FROM portions
    `

    db.all(query, [], (err, rows) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        res.status(200).json({
            success:true,
            data:rows
        })
    })
}

// for UPDATE
const updatePortion = (req, res) => {
    const { id } = req.params
    const { name, status } = req.body

    const query = `
        UPDATE portions
        SET
            name = COALESCE(?, name)
            status = COALESCE(?, status)
        WHERE id = ?
    `
    const params = [name, status, id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        } 
        
        if(this.changes === 0) {
            return res.status(404).json({success:false,data:"Portion not found."})
        } else {
            return res.status(200).json({success:true,data:`Changes to this portion id.${this.lastID}: ${this.changes}`})
        }
    })
}

// for DELETE
const deletePortion = (req, res) => {
    const { id } = req.params
    const query = `DELETE FROM portions WHERE id = ?`
    const params = [id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(this.changes > 0) {
            return res.status(200).json({success:true,data:`Portion successfully deleted! Changes: ${this.changes}`})
        } else {
            return res.status(404).json({success:false,data:"Portion not found."})
        }
    })
}

module.exports = { createPortion, getAllPortions, updatePortion, deletePortion }