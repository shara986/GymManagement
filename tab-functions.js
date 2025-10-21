function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');

    // Load tab-specific data
    switch(tabName) {
        case 'schedule':
            loadScheduleData();
            break;
        case 'plans':
            loadPlansData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'messages':
            loadMessagesData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'payments':
            loadPaymentsData();
            break;
        case 'announcements':
            loadAnnouncementsData();
            break;
    }
}

// Tab-specific functions
function showAddSessionModal() {
    // Implementation for adding training session
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Add Training Session</h2>
            <form id="add-session-form">
                <div class="form-group">
                    <label for="session-client">Client:</label>
                    <select id="session-client" required>
                        <option value="">Select Client</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="session-date">Date:</label>
                    <input type="date" id="session-date" required>
                </div>
                <div class="form-group">
                    <label for="session-time">Time:</label>
                    <input type="time" id="session-time" required>
                </div>
                <div class="form-group">
                    <label for="session-type">Session Type:</label>
                    <select id="session-type" required>
                        <option value="personal">Personal Training</option>
                        <option value="group">Group Session</option>
                        <option value="consultation">Consultation</option>
                    </select>
                </div>
                <button type="submit" class="submit-btn">Schedule Session</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Load clients for dropdown
    loadClientsForSession();
}

function showCreatePlanModal() {
    // Implementation for creating workout plan
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Create Workout Plan</h2>
            <form id="create-plan-form">
                <div class="form-group">
                    <label for="plan-name">Plan Name:</label>
                    <input type="text" id="plan-name" required>
                </div>
                <div class="form-group">
                    <label for="plan-client">Assign to Client:</label>
                    <select id="plan-client" required>
                        <option value="">Select Client</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="plan-duration">Duration (weeks):</label>
                    <input type="number" id="plan-duration" min="1" max="12" required>
                </div>
                <div class="form-group">
                    <label for="plan-goal">Goal:</label>
                    <select id="plan-goal" required>
                        <option value="lose-weight">Lose Weight</option>
                        <option value="gain-muscle">Gain Muscle</option>
                        <option value="maintain-health">Maintain Health</option>
                        <option value="increase-stamina">Increase Stamina</option>
                    </select>
                </div>
                <button type="submit" class="submit-btn">Create Plan</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Load clients for dropdown
    loadClientsForPlan();
}

function showAddUserModal() {
    document.getElementById('add-user-modal').style.display = 'block';
}

function showBulkActions() {
    alert('Bulk actions modal would open here');
}

function showCreateAnnouncementModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Create Announcement</h2>
            <form id="create-announcement-form">
                <div class="form-group">
                    <label for="announcement-title">Title:</label>
                    <input type="text" id="announcement-title" required>
                </div>
                <div class="form-group">
                    <label for="announcement-content">Content:</label>
                    <textarea id="announcement-content" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label for="announcement-target">Target Audience:</label>
                    <select id="announcement-target" required>
                        <option value="all">All Users</option>
                        <option value="members">Members Only</option>
                        <option value="trainers">Trainers Only</option>
                    </select>
                </div>
                <button type="submit" class="submit-btn">Send Announcement</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function generateReport() {
    const period = document.getElementById('report-period').value;
    // Implementation for generating performance report
    fetch(`http://localhost:5000/trainer-reports?period=${period}`)
        .then(response => response.json())
        .then(data => {
            // Update charts with report data
            updateAttendanceChart(data.attendance);
            updateImprovementChart(data.improvement);
        })
        .catch(error => console.error('Error generating report:', error));
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message) {
        const selectedClient = document.querySelector('.client-item.active');
        if (selectedClient) {
            const clientId = selectedClient.dataset.clientId;
            // Send message to server
            fetch('http://localhost:5000/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientId: clientId,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                // Add message to chat
                const chatMessages = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message sent';
                messageDiv.innerHTML = `<p>${message}</p><span class="message-time">${new Date().toLocaleTimeString()}</span>`;
                chatMessages.appendChild(messageDiv);
                messageInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(error => console.error('Error sending message:', error));
        } else {
            alert('Please select a client to message');
        }
    }
}

// Data loading functions for tabs
function loadScheduleData() {
    fetch('http://localhost:5000/trainer-schedule')
        .then(response => response.json())
        .then(data => {
            const calendar = document.getElementById('schedule-calendar');
            // Implementation for rendering schedule calendar
            calendar.innerHTML = '<p>Schedule calendar would be rendered here with sessions data</p>';
        })
        .catch(error => console.error('Error loading schedule:', error));
}

function loadPlansData() {
    fetch('http://localhost:5000/workout-plans')
        .then(response => response.json())
        .then(data => {
            const plansList = document.getElementById('plans-list');
            plansList.innerHTML = '';
            data.plans.forEach(plan => {
                const planCard = document.createElement('div');
                planCard.className = 'plan-card';
                planCard.innerHTML = `
                    <h4>${plan.name}</h4>
                    <p>Client: ${plan.clientName}</p>
                    <p>Duration: ${plan.duration} weeks</p>
                    <p>Goal: ${plan.goal}</p>
                    <button class="action-btn" onclick="editPlan(${plan.id})">Edit</button>
                `;
                plansList.appendChild(planCard);
            });
        })
        .catch(error => console.error('Error loading plans:', error));
}

function loadReportsData() {
    // Load initial report data
    generateReport();
}

function loadMessagesData() {
    fetch('http://localhost:5000/trainer-clients')
        .then(response => response.json())
        .then(data => {
            const messageClients = document.getElementById('message-clients');
            messageClients.innerHTML = '<h4>Select a client to message</h4>';
            data.clients.forEach(client => {
                const clientItem = document.createElement('div');
                clientItem.className = 'client-item';
                clientItem.dataset.clientId = client.id;
                clientItem.innerHTML = `
                    <strong>${client.name}</strong>
                    <small>Last active: ${client.lastActive}</small>
                `;
                clientItem.onclick = () => selectClientForMessaging(client.id, client.name);
                messageClients.appendChild(clientItem);
            });
        })
        .catch(error => console.error('Error loading clients for messaging:', error));
}

function loadAnalyticsData() {
    // Analytics data is already loaded in the main dashboard
}

function loadUsersData() {
    // Users data is already loaded in the main dashboard
}

function loadPaymentsData() {
    fetch('http://localhost:5000/payments-data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('monthly-income').textContent = `$${data.monthlyIncome}`;
            document.getElementById('pending-payments').textContent = data.pendingPayments;
            document.getElementById('overdue-payments').textContent = data.overduePayments;

            const remindersList = document.getElementById('payment-reminders');
            remindersList.innerHTML = '';
            data.reminders.forEach(reminder => {
                const reminderDiv = document.createElement('div');
                reminderDiv.className = `payment-reminder ${reminder.overdue ? 'overdue' : ''}`;
                reminderDiv.innerHTML = `
                    <span>${reminder.clientName} - $${reminder.amount} due ${reminder.dueDate}</span>
                    <button class="action-btn small" onclick="sendReminder(${reminder.id})">Send Reminder</button>
                `;
                remindersList.appendChild(reminderDiv);
            });
        })
        .catch(error => console.error('Error loading payments data:', error));
}

function loadAnnouncementsData() {
    fetch('http://localhost:5000/announcements')
        .then(response => response.json())
        .then(data => {
            const announcementsList = document.getElementById('announcements-list');
            announcementsList.innerHTML = '';
            data.announcements.forEach(announcement => {
                const announcementDiv = document.createElement('div');
                announcementDiv.className = 'announcement-item';
                announcementDiv.innerHTML = `
                    <h4>${announcement.title}</h4>
                    <p>${announcement.content}</p>
                    <div class="announcement-meta">
                        Sent to: ${announcement.target} | ${announcement.date}
                    </div>
                `;
                announcementsList.appendChild(announcementDiv);
            });
        })
        .catch(error => console.error('Error loading announcements:', error));
}

function selectClientForMessaging(clientId, clientName) {
    // Remove active class from all clients
    document.querySelectorAll('.client-item').forEach(item => item.classList.remove('active'));
    // Add active class to selected client
    event.target.closest('.client-item').classList.add('active');

    // Load chat history
    fetch(`http://localhost:5000/messages/${clientId}`)
        .then(response => response.json())
        .then(data => {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML = '';
            data.messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${message.sender === 'trainer' ? 'sent' : 'received'}`;
                messageDiv.innerHTML = `<p>${message.text}</p><span class="message-time">${message.timestamp}</span>`;
                chatMessages.appendChild(messageDiv);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => console.error('Error loading messages:', error));
}

function loadClientsForSession() {
    fetch('http://localhost:5000/trainer-clients')
        .then(response => response.json())
        .then(data => {
            const clientSelect = document.getElementById('session-client');
            data.clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.name;
                clientSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading clients:', error));
}

function loadClientsForPlan() {
    fetch('http://localhost:5000/trainer-clients')
        .then(response => response.json())
        .then(data => {
            const clientSelect = document.getElementById('plan-client');
            data.clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.name;
                clientSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading clients:', error));
}

function updateAttendanceChart(data) {
    const ctx = document.getElementById('attendance-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Attendance Rate (%)',
                data: data.values,
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function updateImprovementChart(data) {
    const ctx = document.getElementById('improvement-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Improvement (%)',
                data: data.values,
                backgroundColor: '#ff6b35',
                borderColor: '#e55a2b',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function editPlan(planId) {
    alert(`Editing plan ${planId}`);
    // Implement edit plan functionality
}

function viewSentAnnouncements() {
    alert('Viewing sent announcements');
    // Implement view sent announcements
}

function sendReminder(paymentId) {
    alert(`Sending reminder for payment ${paymentId}`);
    // Implement send reminder functionality
}
