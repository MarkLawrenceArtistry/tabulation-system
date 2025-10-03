const { db } = require('../database')

// for POST 
const createCandidate = (req, res) => {
    const { full_name, course, section, school, category } = req.body

    if(!req.file) {
        return res.status(400).json({success:false,data:"No image file uploaded."})
    }

    const image = req.file.buffer

    const query = `
        INSERT INTO candidates (full_name, course, section, school, category, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `
    const params = [full_name, course, section, school, category, image]

    db.run(query, params, function(err) {
        if(err) {
            res.status(500).json({success:false,data:err.message})
        } else {
            res.status(201).json({success:true,data:{
                id: this.lastID,
                full_name: full_name,
                course: course,
                section: section,
                school: school,
                category: category
            }})
        }
    })
}

// for GET
const getAllCandidates = (re, res) => {
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

module.exports = { createCandidate, getAllCandidates, getCandidateImage }