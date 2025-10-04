

// CANDIDATES
export const renderCandidatesForJudging = (candidates, divContainer) => {
    divContainer.innerHTML = '';

    if (candidates.length === 0) {
        divContainer.innerHTML = `<p style="text-align:center;">No candidates found for this portion.</p>`;
        return;
    }

    candidates.forEach(candidate => {
        const candidateBox = document.createElement('div');
        candidateBox.className = 'candidate-box box';
        candidateBox.dataset.id = candidate.id;

        candidateBox.innerHTML = `
            <img src="${candidate.imageUrl}">
            <h1>${candidate.full_name}</h1>
            <p>${candidate.course}</p>
            <div>
                <input type="number" class="score-input" placeholder="Enter score">
            </div>
        `;

        divContainer.appendChild(candidateBox);
    });
};




// SCORES
export const renderScores = (scores, divContainer) => {
    divContainer.innerHTML = ``

    if(scores.length === 0) {
        divContainer.innerHTML = `<p style="text-align:center;">No scores found.</p>`
        return 
    }

    const table = document.createElement('table')
    table.className = 'table scores'
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Judge ID</th>
                <th>Candidate ID</th>
                <th>Criterion ID</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody></tbody>
    `
    const tbody = table.querySelector('tbody')

    scores.forEach(score => {
        const row = document.createElement('tr')
        row.className = 'score-item'
        row.dataset.id = score.id

        row.innerHTML = `
            <td>${score.id}</td>
            <td>${score.judge_id}</td>
            <td>${score.candidate_id}</td>
            <td>${score.criterion_id}</td>
            <td>${score.score}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn delete-btn">Delete</button>
                </div>
            </td>
        `

        tbody.appendChild(row)
    });
    
    divContainer.appendChild(table)
}




// PORTIONS
export const renderPortions = (portions, divContainer) => {
    divContainer.innerHTML = ``

    if(portions.length === 0) {
        divContainer.innerHTML = `<p style="text-align:center;">No portions found.</p>`
        return 
    }

    const table = document.createElement('table')
    table.className = 'table portions'
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `
    const tbody = table.querySelector('tbody')

    portions.forEach(portion => {
        const row = document.createElement('tr')
        row.className = 'portion-item'
        row.dataset.id = portion.id

        let isPortionOpen = ``
        if(portion.status !== 'open') {
            isPortionOpen = `
                <div class="action-buttons">
                    <button class="btn open-btn">Start Portion</button>
            `
        }
        isPortionOpen += `
                <button class="btn edit-btn">Edit</button>
                <button class="btn delete-btn">Delete</button>
            </div>
        `

        row.innerHTML = `
            <td>${portion.id}</td>
            <td>${portion.name}</td>
            <td>${portion.status}</td>
            <td>
                ${isPortionOpen}
            </td>
        `

        tbody.appendChild(row)
    });
    
    divContainer.appendChild(table)
}




// CRITERIA
export const renderCriteria = (criteria, divContainer) => {
    divContainer.innerHTML = ``

    if(criteria.length === 0) {
        divContainer.innerHTML = `<p style="text-align:center;">No criteria found.</p>`
        return 
    }

    const table = document.createElement('table')
    table.className = 'table criteria'
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Portion ID</th>
                <th>Name</th>
                <th>Max Score</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `
    const tbody = table.querySelector('tbody')

    criteria.forEach(criterion => {
        const row = document.createElement('tr')
        row.className = 'criterion-item'
        row.dataset.id = criterion.id

        row.innerHTML = `
            <td>${criterion.id}</td>
            <td>${criterion.portion_id}</td>
            <td>${criterion.name}</td>
            <td>${criterion.max_score}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn edit-btn">Edit</button>
                    <button class="btn delete-btn">Delete</button>
                </div>
            </td>
        `

        tbody.appendChild(row)
    });
    
    divContainer.appendChild(table)
}