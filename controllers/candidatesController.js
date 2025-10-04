const { db } = require('../database')

// for POST 
const createCandidate = (req, res) => {
    let { portion_ids, full_name, course, section, school, category } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, data: "No image file uploaded." });
    }
    if (!portion_ids || portion_ids.length === 0) {
        return res.status(400).json({ success: false, data: "At least one portion must be selected." });
    }

    const image = req.file.buffer;
    const candidateQuery = `
        INSERT INTO candidates (full_name, course, section, school, category, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const candidateParams = [full_name, course, section, school, category, image];

    db.run(candidateQuery, candidateParams, function(err) {
        if (err) {
            return res.status(500).json({ success: false, data: err.message });
        }
        
        const candidateId = this.lastID;
        const portionsToLink = Array.isArray(portion_ids) ? portion_ids : portion_ids.split(',');

        const linkQuery = `INSERT INTO candidate_portions (candidate_id, portion_id) VALUES (?, ?)`;

        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            portionsToLink.forEach(portionId => {
                db.run(linkQuery, [candidateId, portionId]);
            });
            db.run('COMMIT', (commitErr) => {
                if(commitErr) {
                    return res.status(500).json({ success: false, data: "Failed to link candidate to portions: " + commitErr.message });
                }
                res.status(201).json({ success: true, data: { id: candidateId, full_name } });
            });
        });
    });
};

// for GET
const getAllCandidates = (re, res) => {
    const query = `
        SELECT id, portion_id, full_name, course, section, school, category
        FROM candidates
    `

    db.all(query, [], (err, rows) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        const candidatesWithImageUrls = rows.map(candidate => {
            return {
                ...candidate,
                imageUrl: `api/candidates/${candidate.id}/image`
            }
        })

        res.status(200).json({
            success:true,
            data:candidatesWithImageUrls
        })
    })
}

// for GET candidate image
const getCandidateImage = (req, res) => {
    const { id } = req.params
    const query = `
        SELECT image FROM candidates WHERE id = ?
    `

    db.get(query, [id], (err, row) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(row && row.image) {
            res.setHeader('Content-Type', 'image/jpg')
            res.send(row.image)
        }
    })
}

// for UPDATE
const updateCandidate = (req, res) => {
    const { id } = req.params
    const { portion_id, full_name, course, section, school, category } = req.body

    let query = `
        UPDATE candidates
        SET
            portion_id = COALESCE(?, portion_id),
            full_name = COALESCE(?, full_name),
            course = COALESCE(?, course),
            section = COALESCE(?, section),
            school = COALESCE(?, school),
            category = COALESCE(?, category)
    `;

    let params = [portion_id, full_name, course, section, school, category]

    if(req.file) {
        query += `, image = COALESCE(?, image)`
        params.push(req.file.buffer)
    }

    query += ` WHERE id = ?`
    params.push(id)

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        } 
        
        if(this.changes === 0) {
            return res.status(404).json({success:false,data:"Candidate not found."})
        } else {
            return res.status(200).json({success:true,data:`Changes to this candidate id.${this.lastID}: ${this.changes}`})
        }
    })
}

// for DELETE
const deleteCandidate = (req, res) => {
    const { id } = req.params
    const query = `DELETE FROM candidates WHERE id = ?`
    const params = [id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(this.changes > 0) {
            return res.status(200).json({success:true,data:`Candidate successfully deleted! Changes: ${this.changes}`})
        } else {
            return res.status(404).json({success:false,data:"Candidate not found."})
        }
    })
}

module.exports = { createCandidate, getAllCandidates, getCandidateImage, updateCandidate, deleteCandidate }