const { db } = require('../database')

// for POST 
const createCriteria = (req, res) => {
    const { portion_id, name, max_score } = req.body

    const query = `
        INSERT INTO criteria (portion_id, name, max_score)
        VALUES (?, ?, ?)
    `
    const params = [portion_id, name, max_score]

    db.run(query, params, function(err) {
        if(err) {
            res.status(500).json({success:false,data:err.message})
        } else {
            res.status(201).json({success:true,data:{
                id: this.lastID,
                portion_id: portion_id,
                name: name,
                max_score: max_score
            }})
        }
    })
}

// for GET
const getAllCriterias = (req, res) => {
    const query = `
        SELECT * FROM criteria
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

// for GET (single data)
const getCriteria = (req, res) => {
    const { id } = req.params
    const query = `
        SELECT * FROM criteria WHERE id = ?
    `
    const params = [id]

    db.get(query, params, (err, row) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }
        
        if(!row) {
            return res.status(404).json({success:false,data:"Criteria not found."})
        } else {
            res.status(200).json({success:true,data:row})
        }
        
    })
}

// for UPDATE
const updateCriteria = (req, res) => {
    const { id } = req.params
    const { portion_id, name, max_score } = req.body

    const query = `
        UPDATE criteria
        SET
            portion_id = COALESCE(?, portion_id)
            name = COALESCE(?, name)
            max_score = COALESCE(?, max_score)
        WHERE id = ?
    `
    const params = [portion_id, name, max_score, id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        } 
        
        if(this.changes === 0) {
            return res.status(404).json({success:false,data:"Criteria not found."})
        } else {
            return res.status(200).json({success:true,data:`Changes to this criteria id.${this.lastID}: ${this.changes}`})
        }
    })
}

// for DELETE
const deleteCriteria = (req, res) => {
    const { id } = req.params
    const query = `DELETE FROM criteria WHERE id = ?`
    const params = [id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(this.changes > 0) {
            return res.status(200).json({success:true,data:`Criteria successfully deleted! Changes: ${this.changes}`})
        } else {
            return res.status(404).json({success:false,data:"Criteria not found."})
        }
    })
}

module.exports = { createCriteria, getAllCriterias, getCriteria, updateCriteria, deleteCriteria }