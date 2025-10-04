const { db } = require('../database')

const judgesState = (req, res) => {
    const judgeId = req.params.id;

    const query = `
        SELECT
            p.id as portion_id,
            p.name as portion_name
        FROM portions p
        WHERE NOT EXISTS (
            SELECT c.id
            FROM candidates c
            WHERE c.portion_id = p.id
            AND NOT EXISTS (
                SELECT s.id
                FROM scores s
                WHERE s.candidate_id = c.id
                AND s.judge_id = ?
            )
        )
    `;

    db.all(query, [judgeId], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, data: err.message });
        }
        
        const completedPortionIds = rows.map(r => r.portion_id);
        res.status(200).json({ success: true, data: { completed_portions: completedPortionIds } });
    });
};

module.exports = { judgesState }