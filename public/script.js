document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    const bodyForAuth = document.getElementById('body');

    async function isAuthenticated() {
        try {
            const response = await fetch('/auth/check-auth', { credentials: 'include' });
            const data = await response.json();
            return response.ok && data.isAuthenticated;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }

    async function showAuthButton() {
        // Remove existing button if any
        const existingButton = document.getElementById("auth-button");
        if (existingButton) {
            existingButton.remove();
        }

        // Create the button dynamically
        const authButton = document.createElement('button');
        authButton.id = "auth-button"; // Ensure only one button exists

        const authenticated = await isAuthenticated(); // Wait for authentication check

        if (authenticated) {
            // User is logged in, show "My Profile" button
            authButton.textContent = "My Profile";
            authButton.onclick = () => window.location.href = "./profile.html";
        } else {
            // User is not logged in, show "Login" button
            authButton.textContent = "Login";
            authButton.onclick = () => window.location.href = "./auth/login.html";
        }

        bodyForAuth.prepend(authButton); // Insert button at the top
    }

    await showAuthButton(); // Ensure the button is rendered correctly

    // Fetch and display products
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            productDiv.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
            `;

            // Add click event to redirect to product page
            productDiv.addEventListener('click', () => {
                window.location.href = `products.html?id=${product._id}`;
            });

            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
});
