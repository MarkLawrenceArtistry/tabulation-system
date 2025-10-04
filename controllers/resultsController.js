const { db } = require('../database');

const getResultsByPortion = (req, res) => {
    const { portionId } = req.params;

    const query = `
        SELECT
            c.id as candidate_id,
            c.full_name,
            c.course,
            c.school,
            SUM(s.score) as total_score,
            COUNT(DISTINCT s.judge_id) as judge_count
        FROM scores s
        JOIN candidates c ON s.candidate_id = c.id
        JOIN criteria cr ON s.criterion_id = cr.id
        WHERE cr.portion_id = ?
        GROUP BY c.id, c.full_name, c.course, c.school
        ORDER BY total_score DESC
    `;

    db.all(query, [portionId], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, data: err.message });
        }
        res.status(200).json({ success: true, data: rows });
    });
};

module.exports = { getResultsByPortion };