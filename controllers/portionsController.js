const { db } = require('../database')

// for POST 
const createPortion = (req, res) => {
    const { name, status } = req.body

    const query = `
        INSERT INTO portions (name, status)
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

// for GET (single data)
const getPortion = (req, res) => {
    const { id } = req.params
    const query = `
        SELECT * FROM portions WHERE id = ?
    `
    const params = [id]

    db.get(query, params, (err, row) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }
        
        if(!row) {
            return res.status(404).json({success:false,data:"Portion not found."})
        } else {
            res.status(200).json({success:true,data:row})
        }
        
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

const getPortionDetails = (req, res) => {
    const { id } = req.params;
    const portionQuery = `SELECT * FROM portions WHERE id = ?`;
    const candidatesQuery = `SELECT id, full_name, course, section, school, category FROM candidates WHERE portion_id = ?`;
    const criteriaQuery = `SELECT id, name, max_score FROM criteria WHERE portion_id = ?`;

    let responseData = {};

    db.get(portionQuery, [id], (err, portion) => {
        if (err) return res.status(500).json({ success: false, data: err.message });
        if (!portion) return res.status(404).json({ success: false, data: "Portion not found." });
        responseData.portion = portion;

        db.all(candidatesQuery, [id], (err, candidates) => {
            if (err) return res.status(500).json({ success: false, data: err.message });
            
            // Add the imageUrl to each candidate, just like in getAllCandidates
            responseData.candidates = candidates.map(c => ({
                ...c,
                imageUrl: `api/candidates/${c.id}/image`
            }));

            db.all(criteriaQuery, [id], (err, criteria) => {
                if (err) return res.status(500).json({ success: false, data: err.message });
                responseData.criteria = criteria;
                res.status(200).json({ success: true, data: responseData });
            });
        });
    });
};

module.exports = { createPortion, getAllPortions, getPortion, updatePortion, deletePortion, getPortionDetails }