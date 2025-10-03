import * as ui from './js/ui.js'
import * as api from './js/api.js'

document.addEventListener('DOMContentLoaded', () => {


    // CANDIDATES DECLARATIONS
    const candidatesContainer = document.querySelector('#candidates-container')



    
    // INITIALIZERS
    async function loadCandidates() {
        try {
            const candidates = await api.fetchCandidates()
            ui.renderCandidates(candidates, candidatesContainer)
        } catch(err) {
            console.error(err)
        }
    }




    // CALLERS
    if(window.location.pathname.endsWith("judges-dashboard.html")) {
        loadCandidates()
    }
})