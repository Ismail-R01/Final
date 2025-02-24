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
        if (existingButton) existingButton.remove();

        // Create the button dynamically
        const authButton = document.createElement('button');
        authButton.id = "auth-button";
        authButton.style.position = "absolute";
        authButton.style.top = "10px";
        authButton.style.right = "10px";
        authButton.style.padding = "10px 15px";
        authButton.style.border = "none";
        authButton.style.backgroundColor = "#007bff";
        authButton.style.color = "#fff";
        authButton.style.cursor = "pointer";
        authButton.style.fontSize = "16px";
        authButton.style.borderRadius = "5px";

        const authenticated = await isAuthenticated();

        if (authenticated) {
            authButton.textContent = "My Profile";
            authButton.onclick = () => window.location.href = "./profile.html";
        } else {
            authButton.textContent = "Login";
            authButton.onclick = () => window.location.href = "./auth/login.html";
        }

        document.body.appendChild(authButton);
    }

    await showAuthButton();

    // Fetch and display products
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.style.border = "1px solid #ddd";
            productDiv.style.padding = "10px";
            productDiv.style.margin = "10px";
            productDiv.style.display = "inline-block";
            productDiv.style.width = "200px";
            productDiv.style.textAlign = "center";
            productDiv.style.cursor = "pointer";
            productDiv.style.borderRadius = "5px";

            const productImg = document.createElement('img');
            productImg.src = product.imageUrl;
            productImg.alt = product.name;
            productImg.style.width = "100px";
            productImg.style.height = "100px";
            productImg.style.objectFit = "cover";
            productImg.style.display = "block";
            productImg.style.margin = "0 auto";

            const productName = document.createElement('h3');
            productName.textContent = product.name;
            productName.style.fontSize = "16px";

            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;
            productDescription.style.fontSize = "14px";

            const productPrice = document.createElement('p');
            productPrice.textContent = `$${product.price}`;
            productPrice.style.color = "green";
            productPrice.style.fontWeight = "bold";

            productDiv.appendChild(productImg);
            productDiv.appendChild(productName);
            productDiv.appendChild(productDescription);
            productDiv.appendChild(productPrice);

            productDiv.addEventListener('click', () => {
                window.location.href = `products.html?id=${product._id}`;
            });

            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
});
