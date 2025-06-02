document.addEventListener('DOMContentLoaded', () => {
    const createOrderForm = document.getElementById('create-order-form');
    const ordersList = document.getElementById('orders-list');
    const orderDetails = document.getElementById('order-details');
    const cancelOrderBtn = document.getElementById('cancel-order');
    const changeDestinationForm = document.getElementById('change-destination-form');

   
    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };


    if (createOrderForm) {
        createOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const receiver = document.getElementById('receiver').value;
            const destination = document.getElementById('destination').value;
            const weight = parseFloat(document.getElementById('weight').value);
            const quote = parseFloat(document.getElementById('quote').value);
            const errorElement = document.getElementById('order-error');

       
            if (!receiver || !destination || isNaN(weight) || isNaN(quote)) {
                errorElement.textContent = 'All fields are required and must be valid.';
                return;
            }

            if (weight <= 0) {
                errorElement.textContent = 'Weight must be greater than 0.';
                return;
            }

            if (quote < 0) {
                errorElement.textContent = 'Quote cannot be negative.';
                return;
            }

            const currentUser = localStorage.getItem('currentUser');
            const parcels = JSON.parse(localStorage.getItem('parcels') || '[]');
            const newParcel = {
                id: generateUUID(),
                userEmail: currentUser,
                receiver,
                destination,
                weight,
                quote,
                status: 'Active',
                createdAt: new Date().toISOString()
            };

            parcels.push(newParcel);
            localStorage.setItem('parcels', JSON.stringify(parcels));
            window.location.href = 'all-orders.html';
        });
    }


    if (ordersList) {
        const currentUser = localStorage.getItem('currentUser');
        const parcels = JSON.parse(localStorage.getItem('parcels') || '[]');
        const userParcels = parcels.filter(parcel => parcel.userEmail === currentUser);

        if (userParcels.length === 0) {
            ordersList.innerHTML = '<p>No orders found.</p>';
        } else {
            userParcels.forEach(parcel => {
                const orderCard = document.createElement('div');
                orderCard.classList.add('order-card');
                orderCard.innerHTML = `
                    <h3>Order #${parcel.id.slice(0, 8)}</h3>
                    <p>Receiver: ${parcel.receiver}</p>
                    <p>Destination: ${parcel.destination}</p>
                    <p>Status: ${parcel.status}</p>
                    <a href="order-details.html?id=${parcel.id}" class="btn">View Details</a>
                `;
                ordersList.appendChild(orderCard);
            });
        }
    }

    if (orderDetails) {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        const parcels = JSON.parse(localStorage.getItem('parcels') || '[]');
        const parcel = parcels.find(p => p.id === orderId);

        if (parcel) {
            orderDetails.innerHTML = `
                <h3>Order #${parcel.id.slice(0, 8)}</h3>
                <p>Receiver: ${parcel.receiver}</p>
                <p>Destination: ${parcel.destination}</p>
                <p>Weight: ${parcel.weight} kg</p>
                <p>Quote: $${parcel.quote}</p>
                <p>Status: ${parcel.status}</p>
                <p>Created: ${new Date(parcel.createdAt).toLocaleString()}</p>
            `;
            if (parcel.status === 'Cancelled') {
                document.getElementById('cancel-order').style.display = 'none';
                document.getElementById('change-destination').style.display = 'none';
            }
        } else {
            orderDetails.innerHTML = '<p>Order not found.</p>';
        }


        if (cancelOrderBtn) {
            cancelOrderBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to cancel this order?')) {
                    const updatedParcels = parcels.map(p => {
                        if (p.id === orderId) {
                            return { ...p, status: 'Cancelled' };
                        }
                        return p;
                    });
                    localStorage.setItem('parcels', JSON.stringify(updatedParcels));
                    window.location.reload();
                }
            });
        }
    }

  
    if (changeDestinationForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        changeDestinationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newDestination = document.getElementById('new-destination').value;
            const errorElement = document.getElementById('destination-error');

            if (!newDestination) {
                errorElement.textContent = 'New destination is required.';
                return;
            }

            const parcels = JSON.parse(localStorage.getItem('parcels') || '[]');
            const updatedParcels = parcels.map(p => {
                if (p.id === orderId) {
                    return { ...p, destination: newDestination };
                }
                return p;
            });
            localStorage.setItem('parcels', JSON.stringify(updatedParcels));
            window.location.href = `order-details.html?id=${orderId}`;
        });
    }
});