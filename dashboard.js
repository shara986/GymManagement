// Get user data from localStorage
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'login.html';
}



const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
if (user && user.name) {
    userName.textContent = user.name;
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
} else {
    userName.textContent = 'User';
    userAvatar.src = `https://ui-avatars.com/api/?name=User`;
}

const questions = [
    {
        question: "What is your age group?",
        options: ["Under 18", "18-30", "31-50", "50+"],
        key: "age"
    },
    {
        question: "What is your fitness goal?",
        options: ["Lose Weight", "Gain Muscle", "Maintain Health", "Increase Stamina"],
        key: "goal"
    },
    {
        question: "How many meals do you prefer per day?",
        options: ["2 meals", "3 meals", "4-5 meals", "More than 5 meals"],
        key: "meals"
    },
    {
        question: "Do you have any dietary restrictions?",
        options: ["Vegetarian", "Vegan", "Gluten-Free", "No restrictions"],
        key: "diet"
    },
    {
        question: "How active are you?",
        options: ["Sedentary", "Lightly Active", "Moderately Active", "Highly Active"],
        key: "activity"
    },
    {
        question: "What is your gender?",
        options: ["Male", "Female", "Other"],
        key: "gender"
    },
    {
        question: "What is your height (in cm)?",
        input: true,
        key: "height"
    },
    {
        question: "What is your weight (in kg)?",
        input: true,
        key: "weight"
    },
    {
        question: "What is your current fitness experience level?",
        options: ["Beginner", "Intermediate", "Advanced"],
        key: "experience"
    }
];

let answers = {};
let currentQuestion = 0;

const questionContainer = document.getElementById('question-container');
const resultsPage = document.getElementById('results-page');
const dietText = document.getElementById('diet-text');
const workoutText = document.getElementById('workout-text');
const tipsText = document.getElementById('tips-text');
const restartBtn = document.getElementById('restart-btn');

function showQuestion(index) {
    // Hide all question steps
    const questionSteps = document.querySelectorAll('.question-step');
    questionSteps.forEach(step => step.style.display = 'none');

    // Show current question step
    const currentStep = document.getElementById(`question-${index}`);
    if (currentStep) {
        currentStep.style.display = 'block';
    }

    // Add event listeners to buttons in current step
    const buttons = currentStep.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const key = btn.getAttribute('data-key');
            const value = btn.getAttribute('data-value');
            answers[key] = value;
            currentQuestion++;
            updateProgressIndicator();
            if (currentQuestion < 5) { // Only 5 questions in HTML
                showQuestion(currentQuestion);
            } else {
                generateDietPlan();
            }
        });
    });
}

function updateProgressIndicator() {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        if (index < currentQuestion) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

async function generateDietPlan() {
    // Calculate BMI, BMR, TDEE
    const height = parseFloat(answers.height);
    const weight = parseFloat(answers.weight);
    const bmi = weight / ((height / 100) ** 2);

    let age;
    if (answers.age === "Under 18") age = 16;
    else if (answers.age === "18-30") age = 24;
    else if (answers.age === "31-50") age = 40;
    else age = 60;

    const isMale = answers.gender === "Male";
    const bmr = isMale
        ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

    let activityFactor;
    if (answers.activity === "Sedentary") activityFactor = 1.2;
    else if (answers.activity === "Lightly Active") activityFactor = 1.375;
    else if (answers.activity === "Moderately Active") activityFactor = 1.55;
    else activityFactor = 1.725;

    const tdee = bmr * activityFactor;

    // Generate Diet Plan based on goals and preferences
    let dietPlan = `Your Personalized Diet Plan\n\n`;

    if (answers.goal === "Lose Weight") {
        dietPlan += "Focus: Weight Loss\n\n";
        dietPlan += "- High protein, moderate carb meals for satiety.\n";
        dietPlan += "- Lean proteins: chicken, turkey, fish, eggs, tofu.\n";
        dietPlan += "- Vegetables: broccoli, spinach, kale, zucchini.\n";
        dietPlan += "- Healthy fats: avocado, nuts, olive oil (in moderation).\n";
        dietPlan += "- Limit: processed foods, sugary drinks, refined carbs.\n";
    } else if (answers.goal === "Gain Muscle") {
        dietPlan += "Focus: Muscle Gain\n\n";
        dietPlan += "- Calorie surplus with high protein intake.\n";
        dietPlan += "- Proteins: chicken, beef, fish, eggs, dairy, legumes.\n";
        dietPlan += "- Complex carbs: sweet potatoes, brown rice, oats, quinoa.\n";
        dietPlan += "- Healthy fats: nuts, seeds, avocados, fatty fish.\n";
        dietPlan += "- Post-workout: protein shake or meal within 30-60 min.\n";
    } else if (answers.goal === "Maintain Health") {
        dietPlan += "Focus: Health Maintenance\n\n";
        dietPlan += "- Balanced macronutrients for overall wellness.\n";
        dietPlan += "- Proteins: variety from animal and plant sources.\n";
        dietPlan += "- Carbs: whole grains, fruits, vegetables.\n";
        dietPlan += "- Fats: unsaturated fats from healthy sources.\n";
        dietPlan += "- Focus: nutrient density and variety.\n";
    } else if (answers.goal === "Increase Stamina") {
        dietPlan += "Focus: Endurance Building\n\n";
        dietPlan += "- High carb focus for glycogen storage.\n";
        dietPlan += "- Complex carbs: oats, rice, potatoes, fruits.\n";
        dietPlan += "- Proteins: moderate amounts for recovery.\n";
        dietPlan += "- Hydration: electrolytes for long sessions.\n";
        dietPlan += "- Timing: carbs before/after workouts.\n";
    }

    // Dietary restrictions
    if (answers.diet === "Vegan") {
        dietPlan += "\nVegan Adaptations:\n";
        dietPlan += "- Proteins: lentils, chickpeas, tofu, tempeh, seitan.\n";
        dietPlan += "- Calcium: fortified plant milks, leafy greens.\n";
        dietPlan += "- B12: fortified foods or supplements.\n";
        dietPlan += "- Iron: lentils, beans, fortified cereals.\n";
    } else if (answers.diet === "Vegetarian") {
        dietPlan += "\nVegetarian Adaptations:\n";
        dietPlan += "- Proteins: dairy, eggs, legumes, nuts.\n";
        dietPlan += "- Include: yogurt, cheese, eggs regularly.\n";
        dietPlan += "- Supplements: B12 if needed.\n";
    } else if (answers.diet === "Gluten-Free") {
        dietPlan += "\nGluten-Free Adaptations:\n";
        dietPlan += "- Grains: rice, quinoa, buckwheat, millet.\n";
        dietPlan += "- Check: all packaged foods for gluten.\n";
        dietPlan += "- Alternatives: gluten-free oats, rice noodles.\n";
    }

    // Meal frequency
    dietPlan += `\nMeal Frequency (${answers.meals}):\n`;
    if (answers.meals === "2 meals") {
        dietPlan += "- Large breakfast and dinner with nutrient-dense foods.\n";
        dietPlan += "- Consider healthy snacks if hungry.\n";
    } else if (answers.meals === "3 meals") {
        dietPlan += "- Balanced breakfast, lunch, dinner.\n";
        dietPlan += "- Include protein, carbs, fats in each meal.\n";
    } else if (answers.meals === "4-5 meals") {
        dietPlan += "- 3 main meals + 1-2 snacks.\n";
        dietPlan += "- Space meals 3-4 hours apart.\n";
    } else {
        dietPlan += "- Frequent small meals/snacks.\n";
        dietPlan += "- Focus on nutrient density.\n";
    }

    dietText.textContent = dietPlan;

    // Generate Workout Plan
    workoutText.textContent = generateWorkoutPlan();

    // Generate Additional Tips
    tipsText.textContent = generateAdditionalTips();

    // Submit fitness test to database
    try {
        const response = await fetch('http://localhost:5000/submit-fitness-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, answers: answers, bmi: bmi.toFixed(1), bmr: Math.round(bmr), tdee: Math.round(tdee) })
        });

        if (response.ok) {
            console.log('Fitness test submitted successfully');
        } else {
            console.error('Failed to submit fitness test');
        }
    } catch (error) {
        console.error('Error submitting fitness test:', error);
    }

    // Show results
    questionContainer.style.display = 'none';
    resultsPage.style.display = 'block';
}

function generateWorkoutPlan() {
    let plan = "Suggested Workout Plan:\n\n";

    if (answers.goal === "Lose Weight") {
        plan += "- Cardio-focused: 30-45 minutes of moderate cardio 4-5 times/week.\n";
        plan += "- Strength training: 2-3 times/week focusing on full-body exercises.\n";
        plan += "- Include HIIT sessions for efficient calorie burn.\n";
        plan += "- Activities: Running, cycling, swimming, or brisk walking.\n";
    } else if (answers.goal === "Gain Muscle") {
        plan += "- Strength training: 4-5 times/week with progressive overload.\n";
        plan += "- Focus on compound movements: squats, deadlifts, bench press.\n";
        plan += "- Include both heavy lifting and hypertrophy ranges.\n";
        plan += "- Rest and recovery are crucial for muscle growth.\n";
    } else if (answers.goal === "Maintain Health") {
        plan += "- Balanced routine: Mix of cardio, strength, and flexibility.\n";
        plan += "- Aim for 150 minutes of moderate cardio per week.\n";
        plan += "- Strength training 2 times/week for all major muscle groups.\n";
        plan += "- Include yoga or stretching for flexibility.\n";
    } else if (answers.goal === "Increase Stamina") {
        plan += "- Endurance training: Long cardio sessions 3-4 times/week.\n";
        plan += "- Interval training to build cardiovascular capacity.\n";
        plan += "- Include sport-specific training if applicable.\n";
        plan += "- Focus on breathing techniques and pacing.\n";
    }

    switch (answers.activity) {
        case "Sedentary":
            plan += "\n- Start slow and gradually increase intensity.\n";
            plan += "- Begin with 20-30 minute sessions and build up.\n";
            break;
        case "Lightly Active":
            plan += "\n- Build on your current activity level.\n";
            plan += "- Add structured workouts 3-4 times/week.\n";
            break;
        case "Moderately Active":
            plan += "\n- Maintain consistency with your current routine.\n";
            plan += "- Add variety to prevent boredom and plateaus.\n";
            break;
        case "Highly Active":
            plan += "\n- Focus on recovery and preventing overtraining.\n";
            plan += "- Include cross-training for joint health.\n";
            break;
    }
    return plan;
}

// Generate additional tips text
function generateAdditionalTips() {
    let tips = "Additional Tips:\n\n";
    tips += "- Stay hydrated: Drink at least 8 glasses of water daily.\n";
    tips += "- Get adequate sleep: Aim for 7-9 hours per night.\n";
    tips += "- Track your progress: Keep a journal of your meals and workouts.\n";
    tips += "- Be consistent: Small daily changes lead to big results over time.\n";
    tips += "- Consult professionals: Talk to a doctor before starting new routines.\n\n";
    switch (answers.age) {
        case "Under 18":
            tips += "- Focus on overall development and proper form.\n";
            tips += "- Include a variety of activities for fun and fitness.\n";
            break;
        case "18-30":
            tips += "- Take advantage of high metabolism and recovery ability.\n";
            tips += "- Build healthy habits early for long-term benefits.\n";
            break;
        case "31-50":
            tips += "- Pay attention to joint health and recovery time.\n";
            tips += "- Include stress management in your routine.\n";
            break;
        case "50+":
            tips += "- Focus on bone density and balance exercises.\n";
            tips += "- Regular health check-ups are important.\n";
            break;
    }
    switch (answers.meals) {
        case "2 meals":
            tips += "\n- Consider adding healthy snacks between meals.\n";
            tips += "- Ensure each meal is nutrient-dense.\n";
            break;
        case "3 meals":
            tips += "\n- Include balanced macronutrients in each meal.\n";
            tips += "- Consider adding 1-2 snacks if needed.\n";
            break;
        case "4-5 meals":
            tips += "\n- Space meals evenly throughout the day.\n";
            tips += "- Focus on portion control to avoid overeating.\n";
            break;
        case "More than 5 meals":
            tips += "\n- Ensure meals are substantial, not just snacks.\n";
            tips += "- Monitor total calorie intake carefully.\n";
            break;
    }
    return tips;
}

// Restart the questionnaire
restartBtn.addEventListener('click', () => {
    answers = {};
    currentQuestion = 0;
    resultsPage.style.display = 'none';
    questionContainer.style.display = 'flex';
    showQuestion(currentQuestion);
});



// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
});

// Load dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
}

// Member dashboard functions
function loadMemberDashboard() {
    // Load member name
    if (user && user.name) {
        document.getElementById('member-name').textContent = user.name;
    } else {
        document.getElementById('member-name').textContent = 'User';
    }

    // Start fitness test immediately for members
    startFitnessTest();

    // Load today's workout
    loadTodayWorkout();

    // Load weekly progress
    loadWeeklyProgress();

    // Load achievements
    loadAchievements();

    // Load calendar
    loadCalendar();

    // Load progress chart
    loadProgressChart();
}

function startFitnessTest() {
    // Reset answers and current question
    answers = {};
    currentQuestion = 0;

    // Show question container and hide results
    questionContainer.style.display = 'flex';
    resultsPage.style.display = 'none';

    // Start with first question
    showQuestion(currentQuestion);
}

async function loadTodayWorkout() {
    try {
        const response = await fetch('http://localhost:5000/today-workout');
        const data = await response.json();
        document.getElementById('today-workout').textContent = data.workout || 'No workout scheduled';
    } catch (error) {
        console.error('Error loading today\'s workout:', error);
    }
}

async function loadWeeklyProgress() {
    try {
        const response = await fetch('http://localhost:5000/weekly-progress');
        const data = await response.json();
        document.getElementById('weekly-progress').textContent = `${data.workouts} workouts completed`;
    } catch (error) {
        console.error('Error loading weekly progress:', error);
    }
}

async function loadAchievements() {
    try {
        const response = await fetch('http://localhost:5000/achievements');
        const data = await response.json();
        document.getElementById('achievements').textContent = data.achievement || 'Keep going!';
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
}

function loadCalendar() {
    // Simple calendar implementation
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    calendar.innerHTML = `
        <h4>${monthNames[currentMonth]} ${currentYear}</h4>
        <div class="calendar-grid">
            <div class="calendar-header">Sun</div>
            <div class="calendar-header">Mon</div>
            <div class="calendar-header">Tue</div>
            <div class="calendar-header">Wed</div>
            <div class="calendar-header">Thu</div>
            <div class="calendar-header">Fri</div>
            <div class="calendar-header">Sat</div>
        </div>
    `;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = firstDay.getDay();

    const calendarGrid = calendar.querySelector('.calendar-grid');

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-cell', 'empty');
        calendarGrid.appendChild(emptyCell);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-cell');
        dayCell.textContent = day;
        if (day === today.getDate()) {
            dayCell.classList.add('today');
        }
        calendarGrid.appendChild(dayCell);
    }
}

function loadProgressChart() {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Workouts Completed',
                data: [3, 5, 4, 6],
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}



// Real-time updates
setInterval(() => {
    loadTodayWorkout();
    loadWeeklyProgress();
    loadAchievements();
}, 30000); // Update every 30 seconds

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('trainer-dashboard.html')) {
        loadTrainerDashboard();
    } else if (window.location.pathname.includes('admin-dashboard.html')) {
        loadAdminDashboard();
    } else {
        renderDashboard();
    }
});
