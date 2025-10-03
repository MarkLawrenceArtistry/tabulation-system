const { db } = require('../database')

// for POST 
const createCandidate = (req, res) => {
    const { full_name, course, section, school, category, image } = req.body

    const query = `
        INSERT INTO candidates (full_name, course, section, school, category, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `
    const params = [full_name, course, section, school, category, image]

    db.run(query, params, function(err) {
        if(err) {
            res.status(500).json({success:false,data:err.message})
        } else {
            res.status(200).json({success:true,data:{
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