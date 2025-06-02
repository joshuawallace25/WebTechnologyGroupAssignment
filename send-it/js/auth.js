document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('signup-error');

    
            if (!name || !email || !password) {
                errorElement.textContent = 'All fields are required.';
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errorElement.textContent = 'Invalid email format.';
                return;
            }

            if (password.length < 6) {
                errorElement.textContent = 'Password must be at least 6 characters.';
                return;
            }

           
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(user => user.email === email)) {
                errorElement.textContent = 'Email already registered.';
                return;
            }

            
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', email);
            window.location.href = 'create-order.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(user => user.email === email && user.password === password);

            if (!user) {
                errorElement.textContent = 'Invalid email or password.';
                return;
            }

            localStorage.setItem('currentUser', email);
            window.location.href = 'all-orders.html';
        });
    }
});