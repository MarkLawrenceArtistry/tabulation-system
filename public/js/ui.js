

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
export const renderCandidatesTable = (candidates, container, onEdit, onDelete) => {
    container.innerHTML = '';
    if (candidates.length === 0) {
        container.innerHTML = '<p>No candidates have been added yet.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'candidates-table-class';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Course</th>
                <th>School</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    candidates.forEach(candidate => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${candidate.imageUrl}" alt="${candidate.full_name}" style="width: 50px; height: auto;"></td>
            <td>${candidate.full_name}</td>
            <td>${candidate.course}</td>
            <td>${candidate.school}</td>
            <td>
                <button class="edit-btn" data-id="${candidate.id}">Edit</button>
                <button class="delete-btn" data-id="${candidate.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    container.appendChild(table);

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            onEdit(id);
        }
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            onDelete(id);
        }
    });
};




// SCORES

export function renderScores(scores, container) {
    if (!scores || scores.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No scores found.</p>';
        return;
    }

    // Create the table structure
    const table = document.createElement('table');
    table.className = 'scores-table';
    
    // Create table header
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Judge ID</th>
                <th>Candidate ID</th>
                <th>Criterion ID</th>
                <th>Score</th>
                <th>Action</th>
            </tr>
        </thead>
    `;

    // Create table body
    const tbody = document.createElement('tbody');
    scores.forEach(score => {
        const row = document.createElement('tr');
        row.className = 'score-item';
        row.dataset.id = score.id;
        
        row.innerHTML = `
            <td>${score.id}</td>
            <td>${score.judge_id}</td>
            <td>${score.candidate_id}</td>
            <td>${score.criterion_id}</td>
            <td>${score.score}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    
    // Clear the container and append the new table
    container.innerHTML = '';
    container.appendChild(table);
}




// PORTIONS UPDATE
export const renderPortions = (portions, container) => {
    if (!container) return;

    if (!portions || portions.length === 0) {
        container.innerHTML = '<p>No portions have been added yet.</p>';
        return;
    }

    // Clear previous content
    container.innerHTML = '';

    // Create and append each portion item as a styled div
    portions.forEach(portion => {
        const portionDiv = document.createElement('div');
        portionDiv.className = 'portion-item';
        portionDiv.dataset.id = portion.id;

        portionDiv.innerHTML = `
            <div class="portion-details">
                <span class="portion-name">${portion.name}</span>
                <span class="portion-status">Status: ${portion.status}</span>
            </div>
            <button class="delete-btn">Delete</button>
        `;
        container.appendChild(portionDiv);
    });
};

export const renderPortionCheckboxes = (portions, container) => {
    container.innerHTML = '';
    if (portions.length === 0) {
        container.innerHTML = '<p>No portions found. Please create one first.</p>';
        return;
    }
    portions.forEach(portion => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" name="portion_ids" value="${portion.id}">
            ${portion.name}
        `;
        container.appendChild(label);
    });
};

// CRITERIA
export const renderCriteria = (criteria, container) => {
    if (!container) return;

    if (!criteria || criteria.length === 0) {
        container.innerHTML = `<p>No criteria found.</p>`;
        return;
    }

    // Clear the container first
    container.innerHTML = '';

    const table = document.createElement('table');
    // Apply the new class that our CSS is targeting
    table.className = 'criteria-table-class'; 

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
    `;
    
    const tbody = document.createElement('tbody');
    criteria.forEach(criterion => {
        const row = document.createElement('tr');
        row.className = 'criterion-item';
        row.dataset.id = criterion.id;

        row.innerHTML = `
            <td>${criterion.id}</td>
            <td>${criterion.portion_id}</td>
            <td>${criterion.name}</td>
            <td>${criterion.max_score}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
};




// RESULTS
export const renderResultsTable = (results, container) => {
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No scores have been submitted for this portion yet.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'results-table'; // Apply our new class

    table.innerHTML = `
        <thead>
            <tr>
                <th>Rank</th>
                <th>Candidate Name</th>
                <th>Course & School</th>
                <th style="text-align: center;">Judges Voted</th>
                <th>Total Score</th>
            </tr>
        </thead>
    `;
    const tbody = document.createElement('tbody');

    results.forEach((result, index) => {
        const row = document.createElement('tr');

        // --- THE UPDATE: Add special classes for the top 3 ranks ---
        if (index === 0) row.classList.add('rank-first');
        else if (index === 1) row.classList.add('rank-second');
        else if (index === 2) row.classList.add('rank-third');

        row.innerHTML = `
            <td class="rank">${index + 1}</td>
            <td>${result.full_name}</td>
            <td>${result.course} - ${result.school}</td>
            <td style="text-align: center;">${result.judge_count}</td>
            <td class="total-score">${result.total_score.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
};