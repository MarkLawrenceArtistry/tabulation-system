

// CANDIDATES
export async function fetchCandidates() {

    const response = await fetch('api/candidates')
    if(!response.ok) {
        throw new Error('Error fetching candidates.')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
export async function addCandidate(formData) {
    
    const response = await fetch(`api/candidates/`, {
        method: 'POST',
        body: formData
    })
    if(!response.ok) {
        throw new Error('Error adding candidates.')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}



// AUTH
export async function loginUser(credentials) {
    const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify(credentials)
    })

    if(!response.ok) {
        throw new Error('Invalid username or password.')
    }

    const result = await response.json()
    return result
}
export async function registerUser(credentials) {
    const response = await fetch('api/auth/register', {
        method: 'POST',
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify(credentials)
    })

    if(!response.ok) {
        throw new Error('Invalid username or password.')
    }

    const result = await response.json()
    return result
}



// SCORES, JUDGES
export async function submitScores(scoresPayload) {
    const response = await fetch(`api/scores/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(scoresPayload)
    })
    if(!response.ok) {
        throw new Error('Error submitting candidates scores.')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
export async function fetchScores() {
    const response = await fetch('api/scores')
    if(!response.ok) {
        throw new Error('Error fetching scores.')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
export async function deleteScore(scoreID) {
    const response = await fetch(`api/scores/${scoreID}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(!response.ok) {
        throw new Error('Error deleting score')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}



// PORTIONS
export async function fetchPortions() {
    const response = await fetch('api/portions')
    if(!response.ok) {
        throw new Error('Error fetching portions.')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}