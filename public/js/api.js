

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
export async function fetchJudgeProgress(judgeId) {
    const response = await fetch(`api/judges/${judgeId}/progress`);
    if (!response.ok) {
        throw new Error('Error fetching judge progress.');
    }
    const result = await response.json();
    if (!result.success) {
        throw new Error(result.data);
    }
    return result.data;
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
export async function addPortion(data) {
    const response = await fetch(`api/portions/`, {
        method: 'POST',
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify(data)
    })
    if(!response.ok) {
        throw new Error('Error adding portion.')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
export async function deletePortion(portionID) {
    const response = await fetch(`api/portions/${portionID}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(!response.ok) {
        throw new Error('Error deleting portion')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
export async function fetchPortionDetails(portionId) {
    const response = await fetch(`api/portions/${portionId}/details`);
    if (!response.ok) {
        throw new Error('Error fetching portion details.');
    }
    const result = await response.json();
    if (!result.success) {
        throw new Error(result.data);
    }
    return result.data;
}




// CRITERIA
export async function fetchCriteria() {
    const response = await fetch('api/criteria')
    if(!response.ok) {
        throw new Error('Error fetching criteria.')
    }

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}