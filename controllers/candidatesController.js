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
const getAllCandidates = (req, res) => {
    const query = `
        SELECT id, full_name, course, section, school, category
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
    const { id } = req.params;
    const { portion_ids, full_name, course, section, school, category } = req.body;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        let updateQuery = `
            UPDATE candidates
            SET
                full_name = COALESCE(?, full_name),
                course = COALESCE(?, course),
                section = COALESCE(?, section),
                school = COALESCE(?, school),
                category = COALESCE(?, category)
        `;
        let params = [full_name, course, section, school, category];

        if (req.file) {
            updateQuery += `, image = ?`;
            params.push(req.file.buffer);
        }

        updateQuery += ` WHERE id = ?`;
        params.push(id);

        db.run(updateQuery, params);

        if (portion_ids) {
            const deleteLinksQuery = `DELETE FROM candidate_portions WHERE candidate_id = ?`;
            db.run(deleteLinksQuery, [id]);

            const portionsToLink = Array.isArray(portion_ids) ? portion_ids : portion_ids.split(',');
            const insertLinkQuery = `INSERT INTO candidate_portions (candidate_id, portion_id) VALUES (?, ?)`;
            portionsToLink.forEach(portionId => {
                if (portionId) {
                    db.run(insertLinkQuery, [id, parseInt(portionId)]);
                }
            });
        }

        db.run('COMMIT', (err) => {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ success: false, data: "Transaction failed: " + err.message });
            }
            res.status(200).json({ success: true, data: `Successfully updated candidate ID: ${id}` });
        });
    });
};

// for DELETE
const deleteCandidate = (req, res) => {
    const { id } = req.params
    const query = `DELETE FROM candidates WHERE id = ?`

    db.run(query, [id], function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }
        if(this.changes > 0) {
            return res.status(200).json({success:true,data:`Candidate successfully deleted!`})
        } else {
            return res.status(404).json({success:false,data:"Candidate not found."})
        }
    })
}

module.exports = { createCandidate, getAllCandidates, getCandidateImage, updateCandidate, deleteCandidate }