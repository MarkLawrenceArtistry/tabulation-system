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

module.exports = { createCandidate }