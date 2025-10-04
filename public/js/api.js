

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