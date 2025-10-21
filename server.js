// server.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// ✅ MySQL connection to single database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sharayu',
    database: 'fitpro'
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error('❌ MySQL Connection Failed for fitpro:', err);
        return;
    }
    console.log('✅ Connected to fitpro Database');
});

// Helper function to get DB connection based on role
function getDbByRole(role) {
    return db; // all roles use the same database now
}


// ==========================
// ✅ Signup API
// ==========================
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Signup always creates members in fitpro

    // Check if email already exists
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists. Please login.' });
        }

        // Insert new user
        const insertSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(insertSql, [name, email, password], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.json({ message: 'User registered successfully' });
        });
    });
});


// ==========================
// ✅ Login API
// ==========================
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check the single database for the user
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found. Please sign up.' });
        }

        const user = results[0];
        if (user.password === password) {
            return res.json({ message: 'Login successful', user: user });
        } else {
            return res.status(401).json({ message: 'Incorrect password' });
        }
    });
});


// ==========================
// ✅ Contact Us API
// ==========================
app.post('/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const sql = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
        db.query(sql, [name, email, message], (err, result) => {
            if (err) {
                console.error('Detailed Database error:', err);
                return res.status(500).json({ message: err.sqlMessage || 'Database error' });
            }

            res.json({ message: 'Your message has been sent successfully!' });
        });
    } catch (err) {
        console.error('Detailed Contact API error:', err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
});




// ==========================
// ✅ Member Progress API
// ==========================
app.get('/today-workout', (req, res) => {
    // Mock data - replace with actual database query
    const workouts = [
        'Push-ups: 3 sets of 10',
        'Squats: 3 sets of 15',
        'Plank: 3 sets of 30 seconds',
        'Rest day - Light stretching'
    ];
    const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)];
    res.json({ workout: randomWorkout });
});

app.get('/weekly-progress', (req, res) => {
    // Mock data - replace with actual database query
    const workoutsCompleted = Math.floor(Math.random() * 7) + 1;
    res.json({ workouts: workoutsCompleted });
});

app.get('/achievements', (req, res) => {
    // Mock data - replace with actual database query
    const achievements = [
        'First workout completed!',
        'Week streak achieved!',
        'Personal record broken!',
        'Consistency champion!'
    ];
    const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
    res.json({ achievement: randomAchievement });
});



// ==========================
// ✅ User Profile API
// ==========================
app.get('/user-profile', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const sql = 'SELECT * FROM user_profiles WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.json({ message: 'Profile not found' });
        }

        res.json(results[0]);
    });
});

app.post('/user-profile', (req, res) => {
    const { userId, height, weight, goal, workoutTypes, medicalConditions } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if profile exists
    const checkSql = 'SELECT id FROM user_profiles WHERE user_id = ?';
    db.query(checkSql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            // Update existing profile
            const updateSql = 'UPDATE user_profiles SET height_cm = ?, weight_kg = ?, fitness_goal = ?, preferred_workout_types = ?, medical_conditions = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?';
            db.query(updateSql, [height, weight, goal, workoutTypes, medicalConditions, userId], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Database error' });
                }
                res.json({ message: 'Profile updated successfully' });
            });
        } else {
            // Insert new profile
            const insertSql = 'INSERT INTO user_profiles (user_id, height_cm, weight_kg, fitness_goal, preferred_workout_types, medical_conditions) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(insertSql, [userId, height, weight, goal, workoutTypes, medicalConditions], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Database error' });
                }
                res.json({ message: 'Profile created successfully' });
            });
        }
    });
});

// ==========================
// ✅ Submit Fitness Test API
// ==========================
app.post('/submit-fitness-test', (req, res) => {
    const { userId, answers } = req.body;

    if (!userId || !answers) {
        return res.status(400).json({ message: 'User ID and answers are required' });
    }

    // Insert fitness test data
    const insertTestSql = 'INSERT INTO fitness_tests (user_id, age_group, goal, meals_preference, dietary_restrictions, activity_level) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertTestSql, [userId, answers.age, answers.goal, answers.meals, answers.diet, answers.activity], (err, result) => {
        if (err) {
            console.error('Database error inserting fitness test:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        // Generate plans based on answers
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

        let workoutPlan = "Suggested Workout Plan:\n\n";
        if (answers.goal === "Lose Weight") {
            workoutPlan += "- Cardio-focused: 30-45 minutes of moderate cardio 4-5 times/week.\n";
            workoutPlan += "- Strength training: 2-3 times/week focusing on full-body exercises.\n";
            workoutPlan += "- Include HIIT sessions for efficient calorie burn.\n";
            workoutPlan += "- Activities: Running, cycling, swimming, or brisk walking.\n";
        } else if (answers.goal === "Gain Muscle") {
            workoutPlan += "- Strength training: 4-5 times/week with progressive overload.\n";
            workoutPlan += "- Focus on compound movements: squats, deadlifts, bench press.\n";
            workoutPlan += "- Include both heavy lifting and hypertrophy ranges.\n";
            workoutPlan += "- Rest and recovery are crucial for muscle growth.\n";
        } else if (answers.goal === "Maintain Health") {
            workoutPlan += "- Balanced routine: Mix of cardio, strength, and flexibility.\n";
            workoutPlan += "- Aim for 150 minutes of moderate cardio per week.\n";
            workoutPlan += "- Strength training 2 times/week for all major muscle groups.\n";
            workoutPlan += "- Include yoga or stretching for flexibility.\n";
        } else if (answers.goal === "Increase Stamina") {
            workoutPlan += "- Endurance training: Long cardio sessions 3-4 times/week.\n";
            workoutPlan += "- Interval training to build cardiovascular capacity.\n";
            workoutPlan += "- Include sport-specific training if applicable.\n";
            workoutPlan += "- Focus on breathing techniques and pacing.\n";
        }

        switch (answers.activity) {
            case "Sedentary":
                workoutPlan += "\n- Start slow and gradually increase intensity.\n";
                workoutPlan += "- Begin with 20-30 minute sessions and build up.\n";
                break;
            case "Lightly Active":
                workoutPlan += "\n- Build on your current activity level.\n";
                workoutPlan += "- Add structured workouts 3-4 times/week.\n";
                break;
            case "Moderately Active":
                workoutPlan += "\n- Maintain consistency with your current routine.\n";
                workoutPlan += "- Add variety to prevent boredom and plateaus.\n";
                break;
            case "Highly Active":
                workoutPlan += "\n- Focus on recovery and preventing overtraining.\n";
                workoutPlan += "- Include cross-training for joint health.\n";
                break;
        }

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

        // Insert plans
        const insertPlanSql = 'INSERT INTO plans (user_id, diet_plan, workout_plan, additional_tips) VALUES (?, ?, ?, ?)';
        db.query(insertPlanSql, [userId, dietPlan, workoutPlan, tips], (err, result) => {
            if (err) {
                console.error('Database error inserting plans:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.json({ message: 'Fitness test submitted successfully' });
        });
    });
});

// ==========================
// ✅ Get Fitness Test Results API
// ==========================
app.get('/fitness-test-results', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const sql = `
        SELECT ft.*, p.diet_plan, p.workout_plan, p.additional_tips
        FROM fitness_tests ft
        LEFT JOIN plans p ON ft.user_id = p.user_id
        WHERE ft.user_id = ?
        ORDER BY ft.created_at DESC
        LIMIT 1
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.json({ message: 'No fitness test results found' });
        }

        res.json(results[0]);
    });
});

// ==========================
// ✅ Workout Reminders API
// ==========================
app.get('/reminders', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const sql = 'SELECT * FROM reminders WHERE user_id = ? ORDER BY reminder_date, reminder_time';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
});

app.post('/reminders', (req, res) => {
    const { userId, date, time, workout, notes } = req.body;
    if (!userId || !date || !workout) {
        return res.status(400).json({ message: 'User ID, date, and workout type are required' });
    }

    const sql = 'INSERT INTO reminders (user_id, reminder_date, reminder_time, workout_type, notes) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userId, date, time, workout, notes], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'Reminder added successfully', id: result.insertId });
    });
});

app.put('/reminders/:id/complete', (req, res) => {
    const { id } = req.params;

    const sql = 'UPDATE reminders SET is_completed = TRUE WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reminder not found' });
        }
        res.json({ message: 'Reminder marked as completed' });
    });
});

app.delete('/reminders/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM reminders WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reminder not found' });
        }
        res.json({ message: 'Reminder deleted successfully' });
    });
});

// ==========================
// ✅ DB Status API
// ==========================
app.get('/db-status', (req, res) => {
    db.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).json({ status: 'disconnected', message: 'Database connection failed' });
        }
        res.json({ status: 'connected', message: 'Database is connected' });
    });
});

// ==========================
// ✅ Start Server
// ==========================
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
