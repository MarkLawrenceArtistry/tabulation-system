

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