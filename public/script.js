import * as ui from './js/ui.js'
import * as api from './js/api.js'

document.addEventListener('DOMContentLoaded', () => {

    // CANDIDATES DECLARATIONS
    const candidateForm = document.querySelector('#candidate-form');
    const portionsCheckboxesContainer = document.querySelector('#portions-checkboxes');
    const candidatesTableContainer = document.querySelector('#candidates-table');
    const formTitle = document.querySelector('#form-title');
    const submitBtn = document.querySelector('#submit-btn');
    const cancelBtn = document.querySelector('#cancel-btn');
    const candidateIdInput = document.querySelector('#candidate-id');

    // AUTH DECLARATIONS
    const loginForm = document.querySelector('#login-form')
    const registerForm = document.querySelector('#register-form')

    // SCORES, JUDGES DECLARATION
    const judgeScoresBtn = document.querySelector('#judge-scores-btn')
    const criteriaSelect = document.querySelector('#criteria-select')
    const judgeScoresContainer = document.querySelector('#judge-scores-container')

    // PORTIONS DECLARATIONS
    const judgePortionsContainer = document.querySelector('#portions-container');
    const portionsForm = document.querySelector("#add-portion-form")
    const portionsContainer = document.querySelector('#portions-container')

    // CRITERIA DECLARATIONS
    const criteriaContainer = document.querySelector('#criteria-container')
    const addCriteriaForm = document.querySelector('#add-criteria-form')

    // RESULTS DECLARATIONS
    const portionSelect = document.querySelector('#portion-select');
    const resultsContainer = document.querySelector('#results-container');

    // OTHER DECLARATIONS
    let allCandidates = [];

    // FILTERING DECLARATIONS
    const judgeFilter = document.querySelector('#judge-filter');
    const candidateFilter = document.querySelector('#candidate-filter');
    const portionFilter = document.querySelector('#portion-filter');
    const searchInput = document.querySelector('#search-input');
    let allScores = []; 

    // --- Modal Declarations ---
    const modal = document.querySelector('#custom-modal');
    const modalMessage = document.querySelector('#modal-message');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // --- Modal Functions ---  
    /**
    * Displays the custom modal with a specific message.
 * @param {string} message The message to show in the modal.
 */
    function showModal(message) {
        if (!modal || !modalMessage) return;
        modalMessage.textContent = message;
        modal.classList.remove('modal-hidden');
    }


    function hideModal() {
            if (!modal) return;
                modal.classList.add('modal-hidden');
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
        // Close modal only if the overlay (the parent) is clicked
            if (e.target === modal) {
                hideModal();
            }
        });
    }

    
    // INITIALIZERS
    async function loadJudgeDashboard() {
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

    // new update for filtering
        async function loadJudgeScores() {
        try {
            const scores = await api.fetchScores();
            allScores = scores; 
            ui.renderScores(scores, judgeScoresContainer);
            populateFilters(scores);

        } catch(err) {
            console.error(err);
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
    async function loadCandidatesAsAdmin() {
        try {
            const [portions, candidates] = await Promise.all([
                api.fetchPortions(),
                api.fetchCandidates()
            ]);
            
            allCandidates = candidates;

            ui.renderPortionCheckboxes(portions, portionsCheckboxesContainer);
            ui.renderCandidatesTable(candidates, candidatesTableContainer, handleEdit, handleDelete);
            
            resetForm();
        } catch (err) {
            console.error('Failed to load page data:', err);
            candidatesTableContainer.innerHTML = `<p>Error loading data: ${err.message}</p>`;
        }
    }
    async function loadTabulationPage() {
        try {
            const portions = await api.fetchPortions();
            portions.forEach(portion => {
                const option = document.createElement('option');
                option.value = portion.id;
                option.textContent = portion.name;
                portionSelect.appendChild(option);
            });
        } catch (err) {
            portionSelect.innerHTML = `<option>Could not load portions</option>`;
            console.error(err);
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
            e.preventDefault()

            const target = e.target
            const criterionItem = target.closest('.criterion-item');
            if (!criterionItem) return;

            const criterionID = criterionItem.dataset.id

            // for delete
            if(target.classList.contains('delete-btn')) {
                if(confirm('Are you sure you want to delete this specific criteria?')) {
                    try {
                        await api.deleteCriteria(criterionID)
                        loadCriteria()
                    } catch(err) {
                        console.error(err)
                    }
                }
            }
        })
    }




    // CANDIDATES
    if(candidateForm) {
        candidateForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(candidateForm);
            const id = candidateIdInput.value;

            if (!id && !formData.get('image').name) {
                alert('Image is required for new candidates.');
                return;
            }

            try {
                if (id) {
                    await api.updateCandidate(id, formData);
                    alert('Candidate updated successfully!');
                } else {
                    await api.addCandidate(formData);
                    alert('Candidate added successfully!');
                }
                resetForm();
                loadCandidatesAsAdmin();
            } catch (err) {
                console.error('Form submission failed:', err);
                alert(`Error: ${err.message}`);
            }
        });
    }
    const resetForm = () => {
        candidateForm.reset();
        candidateIdInput.value = '';
        formTitle.textContent = 'Add New Candidate';
        submitBtn.textContent = 'Add Candidate';
        cancelBtn.style.display = 'none';
        document.querySelector('#image').required = true; 
    };
    const populateFormForEdit = (id) => {
        const candidate = allCandidates.find(c => c.id == id);
        if (!candidate) return;

        candidateIdInput.value = candidate.id;
        document.querySelector('#full_name').value = candidate.full_name;
        document.querySelector('#course').value = candidate.course;
        document.querySelector('#section').value = candidate.section;
        document.querySelector('#school').value = candidate.school;
        document.querySelector('#category').value = candidate.category;

        formTitle.textContent = `Editing: ${candidate.full_name}`;
        submitBtn.textContent = 'Update Candidate';
        cancelBtn.style.display = 'inline-block';
        document.querySelector('#image').required = false;

        window.scrollTo(0, 0);
    };
    const handleEdit = (id) => {
        populateFormForEdit(id);
    };
    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this candidate? This cannot be undone.')) {
            try {
                await api.deleteCandidate(id);
                alert('Candidate deleted successfully!');
                loadCandidatesAsAdmin();
            } catch (err) {
                console.error('Deletion failed:', err);
                alert(`Error: ${err.message}`);
            }
        }
    };
    if(cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
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
                window.location.href = 'judges-dashboard.html'
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
                
                // REPLACED ALERT WITH MODAL
                showModal('Welcome back!');

               
                setTimeout(() => {
                    if(result.data.role === 'Judge') {
                        window.location.href = 'judges-dashboard.html'
                    } else if(result.data.role === 'Admin') {
                        window.location.href = 'admin-dashboard.html'
                    }
                }, 1500);

            } else {
                // REPLACED ALERT WITH MODAL
                showModal(result.data || 'Wrong credentials');
                loginForm.reset();
            }
        } catch (err) {
            // REPLACED ALERT WITH MODAL
            showModal('Wrong credentials');
            loginForm.reset();
            console.error(err);
        }
    });
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




    // RESULT
    if(portionSelect) {
        portionSelect.addEventListener('change', async (e) => {
            const portionId = e.target.value;
            if (!portionId) {
                resultsContainer.innerHTML = '<p>Please select a portion to see the results.</p>';
                return;
            }

            resultsContainer.innerHTML = '<p>Calculating results...</p>';

            try {
                const results = await api.fetchResults(portionId);
                ui.renderResultsTable(results, resultsContainer);
            } catch (err) {
                resultsContainer.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
                console.error(err);
            }
        });
    }

    // New Populate Filters and Apply Filters Functions

    function populateFilters(scores) {
    const judges = [...new Set(scores.map(score => score.judge_name))];
    const candidates = [...new Set(scores.map(score => score.candidate_name))];
    const portions = [...new Set(scores.map(score => score.portion_name))];

    judges.forEach(judge => {
        const option = document.createElement('option');
        option.value = judge;
        option.textContent = judge;
        judgeFilter.appendChild(option);
    });

    candidates.forEach(candidate => {
        const option = document.createElement('option');
        option.value = candidate;
        option.textContent = candidate;
        candidateFilter.appendChild(option);
    });

    portions.forEach(portion => {
        const option = document.createElement('option');
        option.value = portion;
        option.textContent = portion;
        portionFilter.appendChild(option);
    });
}

function applyFilters() {
    let filteredScores = allScores;

    const judge = judgeFilter.value;
    const candidate = candidateFilter.value;
    const portion = portionFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    if (judge) {
        filteredScores = filteredScores.filter(score => score.judge_name === judge);
    }
    if (candidate) {
        filteredScores = filteredScores.filter(score => score.candidate_name === candidate);
    }
    if (portion) {
        filteredScores = filteredScores.filter(score => score.portion_name === portion);
    }
    if (searchTerm) {
        filteredScores = filteredScores.filter(score => score.criterion_name.toLowerCase().includes(searchTerm));
    }

    ui.renderScores(filteredScores, judgeScoresContainer);
}

// Event Listeners for filters
if (judgeFilter) judgeFilter.addEventListener('change', applyFilters);
if (candidateFilter) candidateFilter.addEventListener('change', applyFilters);
if (portionFilter) portionFilter.addEventListener('change', applyFilters);
if (searchInput) searchInput.addEventListener('input', applyFilters);


    // CALLERS
    if(window.location.pathname.endsWith("judges-dashboard.html") && localStorage.getItem('role') === 'Judge') {
        loadJudgeDashboard();
    } else if(window.location.pathname.endsWith("judges-dashboard.html") && localStorage.getItem('role') !== 'Judge') {
        alert('You must be logged in as Judge to view this page. Redirecting..')
        window.location.href = 'index.html'
    }

    if(window.location.pathname.endsWith("admin-dashboard.html") && localStorage.getItem('role') === 'Admin') {
        loadJudgeScores()
    }
    
    if(window.location.pathname.endsWith("tabulation.html") && localStorage.getItem('role') === 'Admin') {
        loadTabulationPage()
    }

    if(window.location.pathname.endsWith("portions.html") && localStorage.getItem('role') === 'Admin') {
        loadPortions()
    }

    if(window.location.pathname.endsWith("criteria.html") && localStorage.getItem('role') === 'Admin') {
        loadCriteria()
    }

    if(window.location.pathname.endsWith("candidates.html") && localStorage.getItem('role') === 'Admin') {
        loadCandidatesAsAdmin() 
    } else if(window.location.pathname.endsWith("candidates.html") && localStorage.getItem('role') === 'Judge') {
        alert('You must be logged in as Admin to view this page. Redirecting..')
        window.location.href = 'index.html'
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