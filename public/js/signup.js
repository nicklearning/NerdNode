document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(loginForm);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        // Check if password meets length requirement
        if (userData.password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        try {
            // Make fetch request to signup endpoint
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });



            // Check if request was successful
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            window.location.href = '/';

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });
});