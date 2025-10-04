import * as ui from './js/ui.js'
import * as api from './js/api.js'

document.addEventListener('DOMContentLoaded', () => {

    // CANDIDATES DECLARATIONS
    const candidatesContainer = document.querySelector('#candidates-container')
    const candidatesForm = document.querySelector('#register-candidate-form')

    // AUTH DECLARATIONS
    const loginForm = document.querySelector('#login-form')
    const registerForm = document.querySelector('#register-form')

    // SCORES, JUDGES DECLARATION
    const judgeScoresBtn = document.querySelector('#judge-scores-btn')
    const criteriaSelect = document.querySelector('#criteria-select')
    const judgeScoresContainer = document.querySelector('#judge-scores-container')

    // PORTIONS
    const portionsContainer = document.querySelector('#portions-container')
    const portionsForm = document.querySelector("#add-portion-form")






    
    // INITIALIZERS
    async function loadCandidates() {
        try {
            const candidates = await api.fetchCandidates()
            ui.renderCandidates(candidates, candidatesContainer)
        } catch(err) {
            console.error(err)
        }
    }
    async function loadJudgeScores() {
        try {
            const scores = await api.fetchScores()
            ui.renderScores(scores, judgeScoresContainer)
        } catch(err) {
            console.error(err)
        }
    }
    async function loadPortions() {
        try {
            const portions = await api.fetchPortions()
            ui.renderPortions(portions, portionsContainer)
        } catch(err) {
            console.error(err)
        }
    }




    // PORTIONS
    if(portionsForm) {
        portionsForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const data = {
                name: document.querySelector('#portion-name').value,
                status: document.querySelector('#portion-status').value
            }

            console.log(data)

            try {
                await api.addPortion(data)
                alert('Added portion successfully')
            } catch(err) {
                console.error(err)
            }

            loadPortions()
        })
    }
    if(portionsContainer) {
        portionsContainer.addEventListener('click', async (e) => {
            e.preventDefault()

            const target = e.target
            const portionItem = target.closest('.portion-item');
            if (!portionItem) return;

            const portionID = portionItem.dataset.id

            // for delete
            if(target.classList.contains('delete-btn')) {
                if(confirm('Are you sure you want to delete this specific portion?')) {
                    try {
                        await api.deletePortion(portionID)
                        loadPortions()
                    } catch(err) {
                        console.error(err)
                    }
                }
            }
        })
    }




    // CANDIDATES
    if(candidatesForm) {
        candidatesForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const formData = new FormData(candidatesForm)

            try {
                const result = await api.addCandidate(formData)
                console.log(result)

                alert('Succesfully registered!')
                candidatesForm.reset()
            } catch(err) {
                console.error('Adding candidate failed:', err, result.data);
                alert('Adding candidate failed: An error occurred during the process. Check your console.');
            }
        })
    }




    // SCORES, JUDGES
    if(judgeScoresBtn) {
        judgeScoresBtn.addEventListener('click', async (e) => {
            e.preventDefault()

            const judgeId = localStorage.getItem('judge_id');
            const criteriaId = criteriaSelect.value;

            if (!judgeId) {
                alert('Error: Judge is not logged in.');
                return;
            }
            if (!criteriaId) {
                alert('Please select a criteria before submitting.');
                return;
            }

            const scoreInputs = document.querySelectorAll('.score-input');
            const scoresPayload = [];

            scoreInputs.forEach(input => {
                const scoreValue = input.value;
                
                if (scoreValue) {
                    const candidateBox = input.closest('.candidate-box');
                    
                console.log(candidateBox.dataset)
                    const candidateId = candidateBox.dataset.id;

                    scoresPayload.push({
                        judge_id: parseInt(judgeId, 10),
                        candidate_id: parseInt(candidateId, 10),
                        criterion_id: parseInt(criteriaId, 10),
                        score: parseInt(scoreValue, 10)
                    });
                }
            });

            if (scoresPayload.length === 0) {
                alert('No scores were entered. Nothing to submit.');
                return;
            }

            try {
                const result = await api.submitScores(scoresPayload)

                alert('Succesfully submitted!')
                console.log(result)
            } catch (err) {
                alert('Error: Check your console.')
                console.error(err)
            }
        })
    }
    if(judgeScoresContainer) {
        judgeScoresContainer.addEventListener('click', async (e) => {
            e.preventDefault()

            const target = e.target
            const scoreItem = target.closest('.score-item');
            if (!scoreItem) return;

            const scoreID = scoreItem.dataset.id

            // for delete
            if(target.classList.contains('delete-btn')) {
                if(confirm('Are you sure you want to delete this specific score?')) {
                    try {
                        await api.deleteScore(scoreID)
                        loadJudgeScores()
                    } catch(err) {
                        console.error(err)
                    }
                }
            }
        })
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
    if(registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const credentials = {
                username: document.querySelector('#username-register').value,
                password: document.querySelector('#password-register').value,
                full_name: document.querySelector('#fullname').value,
                role: document.querySelector('#role').value
            }

            try {
                const result = await api.registerUser(credentials)

                if(result.success) {
                    alert('Succesfully registered!')
                    registerForm.reset()
                    return
                } else {
                    alert(result.data)
                    registerForm.reset()
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

    if(window.location.pathname.endsWith("admin-dashboard.html") && localStorage.getItem('role') === 'Admin') {
        loadJudgeScores()
    }

    if(window.location.pathname.endsWith("portions.html") && localStorage.getItem('role') === 'Admin') {
        loadPortions()
    }


    // GATEKEEPERS
    if(window.location.pathname.endsWith("admin-dashboard.html") && localStorage.getItem('role') !== 'Admin') {
        alert('You must be logged in as Admin to view this page. Redirecting..')
        window.location.href = 'judges-dashboard.html'
    }
    if(window.location.pathname.endsWith("portions.html") && localStorage.getItem('role') !== 'Admin') {
        alert('You must be logged in as Admin to view this page. Redirecting..')
        window.location.href = 'portions.html'
    }
    if(!window.location.pathname.endsWith('index.html') && !localStorage.getItem('isLoggedIn')) {
        alert('You must be logged in to view this page. Redirecting..')
        window.location.href = 'index.html'
    }
})