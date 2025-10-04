import * as ui from './js/ui.js'
import * as api from './js/api.js'

document.addEventListener('DOMContentLoaded', () => {

    // CANDIDATES DECLARATIONS
    const candidatesContainer = document.querySelector('#candidates-container')


    // AUTH DECLARATIONS
    const loginForm = document.querySelector('#login-form')


    
    // INITIALIZERS
    async function loadCandidates() {
        try {
            const candidates = await api.fetchCandidates()
            ui.renderCandidates(candidates, candidatesContainer)
        } catch(err) {
            console.error(err)
        }
    }




    // AUTH
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const credentials = {
                username: document.querySelector('#username').value,
                password: document.querySelector('#password').value
            }

            try {
                const result = await api.loginUser(credentials)

                if(result.success) {
                    localStorage.setItem('isLoggedIn', true)
                    localStorage.setItem('role', result.data.role)
                    localStorage.setItem('judge_id', result.data.id)
                    alert('Welcome back!')
                    window.location.href = 'judges-dashboard.html'
                } else {
                    alert(result.data || 'Wrong credentials')
                    loginForm.reset()
                }
            } catch (err) {
                alert('Wrong credentials')
                loginForm.reset()
                console.error(err)
            }
        })
    }




    // CALLERS
    if(window.location.pathname.endsWith("judges-dashboard.html")) {
        loadCandidates()
    }

    if(!window.location.pathname.endsWith('index.html') && !localStorage.getItem('isLoggedIn')) {
        alert('You must be logged in to view this page. Redirecting..')
        window.location.href = 'index.html'
    }
})