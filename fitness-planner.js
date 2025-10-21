// Get user data from localStorage
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'login.html';
}



const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
userName.textContent = user.name;
userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;

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
    const q = questions[index];
    questionContainer.innerHTML = `<h2>${q.question}</h2>`;
    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.type = 'button'; // Prevent form submission
        btn.classList.add('option-btn');
        btn.textContent = option;
        btn.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent any default behavior
            answers[q.key] = option;
            currentQuestion++;
            if (currentQuestion < questions.length) {
                showQuestion(currentQuestion);
            } else {
                generateDietPlan();
            }
        });
        questionContainer.appendChild(btn);
    });
}

async function generateDietPlan() {
    // Generate Diet Plan
    let dietPlan = "Suggested Diet Plan:\n\n";

    if (answers.goal === "Lose Weight") {
        dietPlan += "- Focus on high protein, low carb meals.\n";
        dietPlan += "- Include lean proteins like chicken, fish, and tofu.\n";
        dietPlan += "- Add plenty of vegetables and some fruits.\n";
        dietPlan += "- Limit processed foods and sugary drinks.\n";
    } else if (answers.goal === "Gain Muscle") {
        dietPlan += "- Include protein shakes, lean meats, and complex carbs.\n";
        dietPlan += "- Eat calorie-dense foods like nuts, avocados, and whole grains.\n";
        dietPlan += "- Focus on post-workout protein intake.\n";
        dietPlan += "- Maintain a slight calorie surplus.\n";
    } else if (answers.goal === "Maintain Health") {
        dietPlan += "- Balanced diet with fruits, vegetables, proteins, and carbs.\n";
        dietPlan += "- Include a variety of colorful vegetables.\n";
        dietPlan += "- Choose whole grains over refined ones.\n";
        dietPlan += "- Stay hydrated and limit processed foods.\n";
    } else if (answers.goal === "Increase Stamina") {
        dietPlan += "- High carb meals with moderate protein and hydration.\n";
        dietPlan += "- Include complex carbs like sweet potatoes and oats.\n";
        dietPlan += "- Focus on electrolyte balance.\n";
        dietPlan += "- Eat smaller, frequent meals for sustained energy.\n";
    }

    if (answers.diet === "Vegan") {
        dietPlan += "\n- Replace animal protein with legumes, tofu, tempeh, and nuts.\n";
        dietPlan += "- Include plant-based milks and fortified foods for nutrients.\n";
    } else if (answers.diet === "Vegetarian") {
        dietPlan += "\n- Include dairy, legumes, and eggs as protein sources.\n";
        dietPlan += "- Consider plant-based alternatives for variety.\n";
    } else if (answers.diet === "Gluten-Free") {
        dietPlan += "\n- Avoid wheat; use rice, quinoa, and gluten-free alternatives.\n";
        dietPlan += "- Check labels for hidden gluten in processed foods.\n";
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
            body: JSON.stringify({ userId: user.id, answers: answers })
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

// Initialize the fitness test on page load
document.addEventListener('DOMContentLoaded', () => {
    showQuestion(currentQuestion);
});
