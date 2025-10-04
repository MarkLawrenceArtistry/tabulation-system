import * as ui from './js/ui.js'
import * as api from './js/api.js'

document.addEventListener('DOMContentLoaded', () => {

    // CANDIDATES DECLARATIONS
    const candidatesContainer = document.querySelector('#candidates-container')
    const candidatesForm = document.querySelector('#register-candidate-form')
    const candidatesHeader = document.querySelector('#candidates-header')

    // AUTH DECLARATIONS
    const loginForm = document.querySelector('#login-form')
    const registerForm = document.querySelector('#register-form')

    // SCORES, JUDGES DECLARATION
    const judgeScoresBtn = document.querySelector('#judge-scores-btn')
    const criteriaSelect = document.querySelector('#criteria-select')
    const judgeScoresContainer = document.querySelector('#judge-scores-container')

    // PORTIONS
    const judgePortionsContainer = document.querySelector('#portions-container');
    const portionsForm = document.querySelector("#add-portion-form")
    const portionsContainer = document.querySelector('#portions-container')
    const portionBtnContainer = document.querySelector('#portions')

    // CRITERIA DECLARATIONS
    const criteriaContainer = document.querySelector('#criteria-container')
    const addCriteriaForm = document.querySelector('#add-criteria-form')

    // OTHER DECLARATIONS




    
    // INITIALIZERS
    async function initializeJudgeDashboard() {
        if (!judgePortionsContainer) return;

        const judgeId = localStorage.getItem('judge_id');
        if (!judgeId) {
            alert('Could not identify judge. Please log in again.');
            return;
        }

        try {
            const [allPortions, progress] = await Promise.all([
                api.fetchPortions(),
                api.fetchJudgeProgress(judgeId)
            ]);
            
            const completedPortionIds = progress.completed_portions;

            judgePortionsContainer.innerHTML = ''; 
            allPortions.forEach(portion => {
                const isCompleted = completedPortionIds.includes(portion.id);
                const button = document.createElement('button');
                button.className = 'portions-btn';
                button.dataset.portionId = portion.id;
                button.textContent = portion.name;
                if (isCompleted) {
                    button.disabled = true;
                    button.textContent += ' ✔️';
                }
                judgePortionsContainer.appendChild(button);
            });

        } catch (err) {
            console.error('Failed to initialize judge dashboard:', err);
            judgePortionsContainer.innerHTML = '<p>Could not load event portions.</p>';
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
    async function loadCriteria() {
        try {
            const criteria = await api.fetchCriteria()
            ui.renderCriteria(criteria, criteriaContainer)
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
    if(judgePortionsContainer) {
        judgePortionsContainer.addEventListener('click', async (e) => {
            if (e.target.matches('.portions-btn')) {
                const portionId = e.target.dataset.portionId;
                const candidatesContainer = document.querySelector('#candidates-container');
                const candidatesHeader = document.querySelector('#candidates-header');
                const criteriaSelect = document.querySelector('#criteria-select');
                const portionTitle = document.querySelector('#portion-title');
                const submitContainer = document.querySelector('#submit-container');

                try {
                    const details = await api.fetchPortionDetails(portionId);

                    portionTitle.textContent = `Portion: ${details.portion.name}`;

                    criteriaSelect.innerHTML = '<option value="">--Please choose a criterion--</option>';
                    details.criteria.forEach(crit => {
                        const option = document.createElement('option');
                        option.value = crit.id;
                        option.textContent = `${crit.name} (Max: ${crit.max_score})`;
                        criteriaSelect.appendChild(option);
                    });

                    ui.renderCandidatesForJudging(details.candidates, candidatesContainer);

                    candidatesHeader.style.display = 'block';
                    candidatesContainer.style.display = 'flex';
                    submitContainer.style.display = 'block';

                } catch (err) {
                    console.error(`Failed to load details for portion ${portionId}:`, err);
                    alert('Could not load details for this portion.');
                }
            }
        });
    }
    if(portionBtnContainer) {
        portionBtnContainer.addEventListener('click', (e) => {
            e.preventDefault()

            let portionBtn = document.querySelectorAll('.portions-btn')
        
            if(portionBtn.textContent === 'Sportswear') {
                localStorage.remove('portion')
                localStorage.setItem('portion', JSON.stringify(1));
            } else if (portionBtn.textContent === 'Swimwear') {
                localStorage.remove('portion')
                localStorage.setItem('portion', JSON.stringify(2));
            }

            candidatesContainer.style.display = 'flex'
            candidatesHeader.style.display = 'block'
        })
    }




    // CRITERIA
    if(addCriteriaForm) {
        addCriteriaForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const data = {
                portion_id: document.querySelector('#criteria-portion-id').value,
                name: document.querySelector('#criteria-name').value,
                max_score: document.querySelector('#criteria-max-score').value,
            }

            try {
                await api.addCriteria(data)
                alert('Added criteria successfully')
            } catch(err) {
                console.error(err)
            }

            loadCriteria()
        })
    }
    if(criteriaContainer) {
        criteriaContainer.addEventListener('click', async (e) => {
            
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
                    if(result.data.role === 'Judge') {
                        window.location.href = 'judges-dashboard.html'
                    } else if(result.data.role === 'Admin') {
                        window.location.href = 'admin-dashboard.html'
                    }
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
    if (window.location.pathname.endsWith("judges-dashboard.html")) {
        initializeJudgeDashboard();
    }

    if(window.location.pathname.endsWith("admin-dashboard.html") && localStorage.getItem('role') === 'Admin') {
        loadJudgeScores()
    }

    if(window.location.pathname.endsWith("portions.html") && localStorage.getItem('role') === 'Admin') {
        loadPortions()
    }

    if(window.location.pathname.endsWith("criteria.html") && localStorage.getItem('role') === 'Admin') {
        loadCriteria()
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