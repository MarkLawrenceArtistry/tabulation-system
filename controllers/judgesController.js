const { db } = require('../database')

const judgesState = (req, res) => {
    const judgeId = req.params.id;

    const query = `
        SELECT
            p.id as portion_id,
            p.name as portion_name
        FROM
            portions p
        WHERE
            NOT EXISTS (
                -- This subquery looks for any candidate in this portion...
                SELECT 1 -- Using 1 is more efficient than selecting a column
                FROM candidate_portions cp
                WHERE cp.portion_id = p.id
                AND NOT EXISTS (
                    -- ...who has NOT been scored by the specified judge.
                    SELECT 1
                    FROM scores s
                    WHERE s.candidate_id = cp.candidate_id -- Corrected Line: Link to the candidate_portion
                    AND s.judge_id = ?
                )
            );
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