document.addEventListener('DOMContentLoaded', () => {
    
    const protectedPages = ['create-order.html', 'all-orders.html', 'order-details.html', 'change-destination.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !localStorage.getItem('currentUser')) {
        window.location.href = 'login.html';
    }

    
    const logoutLink = document.getElementById('logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

   
    const changeDestinationLink = document.getElementById('change-destination');
    if (changeDestinationLink) {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        if (orderId) {
            changeDestinationLink.href = `change-destination.html?id=${orderId}`;
        }
    }
});