// Get user data from localStorage
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'login.html';
}

// Populate user info
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
if (user && user.name) {
    userName.textContent = user.name;
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
} else {
    userName.textContent = 'User';
    userAvatar.src = `https://ui-avatars.com/api/?name=User`;
}

// Load existing profile data on page load
async function loadProfile() {
    try {
        const response = await fetch(`http://localhost:5000/user-profile?userId=${user.id}`);
        const data = await response.json();

        if (data.message === 'Profile not found') {
            // No profile yet, fields remain empty
            return;
        }

        // Populate fields with existing data
        document.getElementById('height').value = data.height_cm || '';
        document.getElementById('weight').value = data.weight_kg || '';
        document.getElementById('fitness-goal').value = data.fitness_goal || '';
        document.getElementById('workout-types').value = data.preferred_workout_types || '';
        document.getElementById('medical-conditions').value = data.medical_conditions || '';
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Save profile data
async function saveProfile() {
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const goal = document.getElementById('fitness-goal').value;
    const workoutTypes = document.getElementById('workout-types').value;
    const medicalConditions = document.getElementById('medical-conditions').value;

    // Basic validation
    if (!height || !weight || !goal) {
        showMessage('Please fill in all required fields (Height, Weight, Fitness Goal).', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/user-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                height: parseInt(height),
                weight: parseFloat(weight),
                goal: goal,
                workoutTypes: workoutTypes,
                medicalConditions: medicalConditions
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Profile saved successfully!', 'success');
            console.log('Profile saved successfully!');

            // Verify data is saved in database
            try {
                const verifyResponse = await fetch(`http://localhost:5000/user-profile?userId=${user.id}`);
                const verifyData = await verifyResponse.json();
                console.log('Verified saved profile data:', verifyData);
            } catch (verifyError) {
                console.error('Error verifying saved profile:', verifyError);
            }
        } else {
            showMessage(data.message || 'Error saving profile.', 'error');
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        showMessage('Error saving profile. Please try again.', 'error');
    }
}

// Show message function
function showMessage(message, type) {
    const messageDiv = document.getElementById('profile-message');
    const messageText = document.getElementById('message-text');
    const closeBtn = document.getElementById('close-message-btn');

    if (messageDiv && messageText && closeBtn) {
        messageText.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        console.log('Showing message:', message, type); // Debug log

        // No auto-hide; user can close manually
    } else {
        console.error('Message elements not found:', { messageDiv, messageText, closeBtn });
    }
}

// Event listeners
const saveBtn = document.getElementById('save-profile-btn');
const closeBtn = document.getElementById('close-message-btn');

if (saveBtn) {
    saveBtn.addEventListener('click', saveProfile);
} else {
    console.error('Save button not found');
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        const messageDiv = document.getElementById('profile-message');
        if (messageDiv) {
            messageDiv.style.display = 'none';
        }
    });
} else {
    console.error('Close button not found');
}

// Check DB status on page load
async function checkDbStatus() {
    try {
        const response = await fetch('http://localhost:5000/db-status');
        const data = await response.json();
        if (data.status === 'connected') {
            console.log('Database is connected');
        } else {
            console.error('Database connection issue:', data.message);
            showMessage('Database connection issue. Please contact support.', 'error');
        }
    } catch (error) {
        console.error('Error checking DB status:', error);
        showMessage('Unable to verify database connection.', 'error');
    }
}

// Load profile on page load
document.addEventListener('DOMContentLoaded', () => {
    checkDbStatus();
    loadProfile();
});
