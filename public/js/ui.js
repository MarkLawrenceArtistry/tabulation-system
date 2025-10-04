

// CANDIDAtES
export const renderCandidates = (candidates, divContainer) => {
    divContainer.innerHTML = ``

    if(candidates.length === 0) {
        divContainer.innerHTML = `<p style="text-align:center;">No candidates found.</p>`
        return
    }

    candidates.forEach(candidate => {
        const candidateBox = document.createElement('div')
        candidateBox.className = 'candidate-box box'
        candidateBox.dataset.id = candidate.id

        candidateBox.innerHTML = `
            <img src="/api/candidates/${candidate.id}/image">
            <h1>${candidate.full_name}</h1>
            <p>${candidate.course}</p>
            <p>${candidate.section}</p>
            <p>${candidate.school}</p>
            <p>${candidate.category}</p>

            <div>
                <input type="text" class="score-input" placeholder="Enter your rating">
            </div>
        `

        divContainer.appendChild(candidateBox)
    });
}