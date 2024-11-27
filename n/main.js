// Cart functionality
class Cart {
    constructor() {
        this.items = {};
        this.total = 0;
    }

    addItem(id, name, price, quantity) {
        if (this.items[id]) {
            this.items[id].quantity += quantity;
        } else {
            this.items[id] = { name, price, quantity };
        }
        this.updateTotal();
    }

    removeItem(id) {
        if (this.items[id]) {
            delete this.items[id];
            this.updateTotal();
        }
    }

    updateQuantity(id, quantity) {
        if (this.items[id]) {
            this.items[id].quantity = quantity;
            this.updateTotal();
        }
    }

    updateTotal() {
        this.total = Object.values(this.items).reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }

    clearCart() {
        this.items = {};
        this.total = 0;
    }
}

// Initialize cart
const cart = new Cart();

// DOM Elements
const cartSidebar = document.querySelector('.cart-sidebar');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('#cart-total-amount');
const cartCount = document.querySelector('.cart-count');
const checkoutModal = document.getElementById('checkout-modal');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cart toggle
    document.querySelector('.cart-icon').addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('open');
    });

    document.querySelector('.close-cart').addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Quantity controls
    document.querySelectorAll('.quantity-controls').forEach(control => {
        const input = control.querySelector('.quantity-input');
        
        control.querySelector('.minus').addEventListener('click', () => {
            input.value = Math.max(1, parseInt(input.value) - 1);
        });

        control.querySelector('.plus').addEventListener('click', () => {
            input.value = parseInt(input.value) + 1;
        });

        input.addEventListener('change', () => {
            input.value = Math.max(1, parseInt(input.value));
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const quantity = parseInt(button.closest('.item-controls')
                                    .querySelector('.quantity-input').value);
            
            cart.addItem(id, name, price, quantity);
            updateCartUI();
            showNotification(`Added ${quantity} ${name} to cart`);
        });
    });

    // Category filters
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterProducts(category);
            
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

    // Sort functionality
    document.getElementById('sort-by').addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });

    // Checkout process
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (Object.keys(cart.items).length > 0) {
            checkoutModal.style.display = 'block';
        } else {
            showNotification('Your cart is empty');
        }
    });

    // Close modal
    document.querySelector('.modal .close').addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    // Handle checkout form
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        processCheckout();
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
});

// UI Update Functions
function updateCartUI() {
    // Update cart items
    cartItems.innerHTML = Object.entries(cart.items).map(([id, item]) => `
        <div class="cart-item" data-id="${id}">
            <img src="/api/placeholder/80/80" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>$${item.price} x ${item.quantity}</p>
                <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item">Remove</button>
            </div>
        </div>
    `).join('');

    // Add remove item listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.closest('.cart-item').dataset.id;
            cart.removeItem(id);
            updateCartUI();
        });
    });

    // Update total and count
    cartTotal.textContent = cart.total.toFixed(2);
    cartCount.textContent = Object.values(cart.items)
        .reduce((sum, item) => sum + item.quantity, 0);
}

function filterProducts(category) {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function sortProducts(method) {
    const container = document.querySelector('.container');
    const items = Array.from(container.children);

    items.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.add-to-cart').dataset.price);
        const priceB = parseFloat(b.querySelector('.add-to-cart').dataset.price);
        const nameA = a.querySelector('h2').textContent;
        const nameB = b.querySelector('h2').textContent;

        switch(method) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'name':
                return nameA.localeCompare(nameB);
            default:
                return 0;
        }
    });

    items.forEach(item => container.appendChild(item));
}

function searchProducts(query) {
    const items = document.querySelectorAll('.item');
    const searchTerm = query.toLowerCase();

    items.forEach(item => {
        const name = item.querySelector('h2').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function processCheckout() {
    // Simulate checkout process
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-order');
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        showNotification('Order placed successfully!');
        cart.clearCart();
        updateCartUI();
        checkoutModal.style.display = 'none';
        cartSidebar.classList.remove('open');
        
        // Reset form
        form.reset();
        submitBtn.textContent = 'Place Order';
        submitBtn.disabled = false;
    }, 1500);
}

function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    // Add notification to DOM
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === checkoutModal) {
        checkoutModal.style.display = "none";
    }
}