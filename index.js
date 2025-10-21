const signupForm = document.getElementById('signup-form');
const signupError = document.getElementById('signup-error');

signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous error
    signupError.textContent = '';

    // Get form values
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    // Validation
    if (!name || !email || !password || !confirm) {
        signupError.textContent = 'Please fill all fields!';
        return;
    }
    if (password !== confirm) {
        signupError.textContent = 'Passwords do not match!';
        return;
    }

    // Disable button
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing up...';

    try {
        // Send data to backend
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Redirect to login page
            window.location.href = 'login.html';
        } else {
            signupError.textContent = result.message || 'Signup failed';
        }

    } catch (error) {
        console.error('Error:', error);
        signupError.textContent = 'Network error. Please try again.';
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
    }
});
