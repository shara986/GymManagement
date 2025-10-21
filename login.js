// script.js or inline <script> for login page
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Clear previous error
    loginError.textContent = '';

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    // Basic frontend validation
    if (!email || !password) {
        loginError.textContent = 'Please enter both email and password';
        return;
    }

    // Disable button
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Ensure response is JSON
        const data = await response.json();

        if (response.ok) {
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect all users to home page after login
            window.location.href = 'home.html';
        } else {
            loginError.textContent = data.message; // Shows proper error (User not found / Incorrect password)
        }
    } catch (err) {
        console.error('Fetch error:', err);
        loginError.textContent = 'Network error. Please try again.';
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
});
