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

// Audio element for ringtone
const ringtone = new Audio('workout-ringtone.mp3');
ringtone.loop = false; // Play once
ringtone.volume = 0.5; // Set volume to 50%

// Function to check for due reminders
function checkReminders() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    // Get reminders from local storage or fetch from server
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');

    reminders.forEach(reminder => {
        if (!reminder.is_completed &&
            reminder.reminder_date === currentDate &&
            reminder.reminder_time === currentTime) {
            // Play ringtone
            ringtone.play().catch(e => console.log('Audio play failed:', e));

            // Show notification
            if (Notification.permission === 'granted') {
                new Notification(`Workout Reminder: ${reminder.workout_type}`, {
                    body: reminder.notes || 'Time for your workout!',
                    icon: 'https://via.placeholder.com/64x64?text=💪'
                });
            }

            // Mark as completed after 1 minute to avoid repeated notifications
            setTimeout(() => {
                markCompleted(reminder.id);
            }, 60000);
        }
    });
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Check reminders every minute
setInterval(checkReminders, 60000);

// Load existing reminders on page load
async function loadReminders() {
    try {
        const response = await fetch(`http://localhost:5000/reminders?userId=${user.id}`);
        const reminders = await response.json();

        // Store reminders in localStorage for the ringtone checker
        localStorage.setItem('reminders', JSON.stringify(reminders));

        const remindersList = document.getElementById('reminders-list');
        remindersList.innerHTML = '';

        if (reminders.length === 0) {
            remindersList.innerHTML = '<p>No reminders set yet.</p>';
            return;
        }

        reminders.forEach(reminder => {
            const reminderDiv = document.createElement('div');
            reminderDiv.className = 'reminder-item';
            reminderDiv.innerHTML = `
                <div class="reminder-details">
                    <strong>${reminder.workout_type}</strong>
                    <p>Date: ${reminder.reminder_date}</p>
                    <p>Time: ${reminder.reminder_time || 'Not set'}</p>
                    <p>Notes: ${reminder.notes || 'None'}</p>
                    <p>Status: ${reminder.is_completed ? 'Completed' : 'Pending'}</p>
                </div>
                <div class="reminder-actions">
                    <button class="btn-secondary" onclick="markCompleted(${reminder.id})">Mark Completed</button>
                    <button class="btn-danger" onclick="deleteReminder(${reminder.id})">Delete</button>
                </div>
            `;
            remindersList.appendChild(reminderDiv);
        });
    } catch (error) {
        console.error('Error loading reminders:', error);
        showMessage('Error loading reminders. Please try again.', 'error');
    }
}

// Add new reminder
async function addReminder() {
    const date = document.getElementById('reminder-date').value;
    const time = document.getElementById('reminder-time').value;
    const workout = document.getElementById('reminder-workout').value;
    const notes = document.getElementById('reminder-notes').value;

    if (!date || !workout) {
        showMessage('Please fill in date and workout type.', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                date: date,
                time: time,
                workout: workout,
                notes: notes
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Reminder added successfully!', 'success');
            loadReminders();
            // Clear form
            document.getElementById('reminder-date').value = '';
            document.getElementById('reminder-time').value = '';
            document.getElementById('reminder-workout').value = '';
            document.getElementById('reminder-notes').value = '';
        } else {
            showMessage(data.message || 'Error adding reminder.', 'error');
        }
    } catch (error) {
        console.error('Error adding reminder:', error);
        showMessage('Error adding reminder. Please try again.', 'error');
    }
}

// Mark reminder as completed
async function markCompleted(reminderId) {
    try {
        const response = await fetch(`http://localhost:5000/reminders/${reminderId}/complete`, {
            method: 'PUT'
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Reminder marked as completed!', 'success');
            loadReminders();
        } else {
            showMessage(data.message || 'Error updating reminder.', 'error');
        }
    } catch (error) {
        console.error('Error updating reminder:', error);
        showMessage('Error updating reminder. Please try again.', 'error');
    }
}

// Delete reminder
async function deleteReminder(reminderId) {
    if (!confirm('Are you sure you want to delete this reminder?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/reminders/${reminderId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Reminder deleted successfully!', 'success');
            loadReminders();
        } else {
            showMessage(data.message || 'Error deleting reminder.', 'error');
        }
    } catch (error) {
        console.error('Error deleting reminder:', error);
        showMessage('Error deleting reminder. Please try again.', 'error');
    }
}

// Show message function
function showMessage(message, type) {
    // Simple alert for now, can be enhanced with a proper message div
    alert(message);
}

// Event listeners
document.getElementById('add-reminder-btn').addEventListener('click', addReminder);

// Load reminders on page load
document.addEventListener('DOMContentLoaded', loadReminders);
