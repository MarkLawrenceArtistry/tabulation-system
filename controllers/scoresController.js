const { db } = require('../database')

// for POST 
const submitScores = (req, res) => {
    const scores = req.body
    console.log(scores)

    if(scores.length === 0) {
        return res.status(404).json({success:false,data:"Empty scores data provided"})
    }

    const query = `
        INSERT INTO scores (judge_id, candidate_id, criterion_id, score) VALUES
    `

    const valuePlaceholders = []
    const params = []

    scores.forEach(score => {
        valuePlaceholders.push('(?, ?, ?, ?)')
        params.push(score.judge_id, score.candidate_id, score.criterion_id, score.score)
    });
    const finalQuery = query + valuePlaceholders.join(', ')
    db.run(finalQuery, params, function(err) {
        if(err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ success: false, data: 'One or more of these scores have already been submitted.' });
            }

            res.status(500).json({success:false,data:err.message})
        } else {
            res.status(201).json({success:true,data:'Submission successful.'})
        }
    })
}

// for GET (without filtering)
const getAllScores = (req, res) => {
    const query = `
        SELECT * FROM scores
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

// for GET (single data) (without filtering) - di alam kung saan gagamitin
const getScore = (req, res) => {
    const { id } = req.params
    const query = `
        SELECT * FROM scores WHERE id = ?
    `
    const params = [id]

    db.get(query, params, (err, row) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }
        
        if(!row) {
            return res.status(404).json({success:false,data:"Score not found."})
        } else {
            res.status(200).json({success:true,data:row})
        }
        
    })
}

// for UPDATE 
const updateScore = (req, res) => {
    const { id } = req.params
    const { judge_id, candidate_id, criterion_id, score } = req.body

    const query = `
        UPDATE criteria
        SET
            judge_id = COALESCE(?, judge_id)
            candidate_id = COALESCE(?, candidate_id)
            criterion_id = COALESCE(?, criterion_id)
            score = COALESCE(?, score)
        WHERE id = ?
    `
    const params = [judge_id, candidate_id, criterion_id, score, id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        } 
        
        if(this.changes === 0) {
            return res.status(404).json({success:false,data:"Score not found."})
        } else {
            return res.status(200).json({success:true,data:`Changes to this score id.${this.lastID}: ${this.changes}`})
        }
    })
}

// for DELETE - di alam kung saan gagamitin
const deleteScore = (req, res) => {
    const { id } = req.params
    const query = `DELETE FROM scores WHERE id = ?`
    const params = [id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(this.changes > 0) {
            return res.status(200).json({success:true,data:`Scores successfully deleted! Changes: ${this.changes}`})
        } else {
            return res.status(404).json({success:false,data:"Scores not found."})
        }
    })
}

module.exports = { submitScores, getAllScores, getScore, updateScore, deleteScore }