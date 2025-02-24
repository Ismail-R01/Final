async function fetchProfile() {
    try {
        const response = await fetch('/auth/profile', { credentials: 'include' });
        const data = await response.json();

        if (response.ok) {
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            fetchUserProducts(); // Fetch user products after getting username
        } else {
            window.location.href = '/auth/login.html'; // Redirect to login if not authenticated
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        window.location.href = '/auth/login.html'; // Redirect to login on error
    }
}

async function fetchUserProducts() {
    try {
        const response = await fetch('/api/user-products', { credentials: 'include' });
        const products = await response.json();
        const productsContainer = document.getElementById('products-container');

        if (products.length === 0) {
            productsContainer.innerHTML = "<p>You have not added any products yet.</p>";
            return;
        }

        productsContainer.innerHTML = ""; // Clear previous content

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            productDiv.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100px; height: auto;">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price" style="font-weight: bold; color: green;">$${product.price}</p>
            <button class="update-btn" data-id="${product._id}" 
                style="background-color: blue; color: white; padding: 8px; border: none; cursor: pointer; border-radius: 5px;">
                Update Product
            </button>
            <button class="delete-btn" data-id="${product._id}" 
                style="background-color: red; color: white; padding: 8px; border: none; cursor: pointer; border-radius: 5px;">
                Delete Product
            </button>
        `;

            productsContainer.appendChild(productDiv);
        });

        // Attach event listeners after rendering products
        document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                updateProduct(productId);
            });
        });

        document.getElementById('products-container').addEventListener('click', async (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const productId = event.target.dataset.id;
                await deleteProduct(productId);
                await fetchUserProducts(); // Refresh the list
            }
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('products-container').innerHTML = "<p>Failed to load products.</p>";
    }
}
function updateProduct(productId) {
    const newName = prompt("Enter new product name (leave blank to keep unchanged):");
    const newDescription = prompt("Enter new product description (leave blank to keep unchanged):");
    const newPrice = prompt("Enter new product price (leave blank to keep unchanged):");

    // Build the update object dynamically
    const updateData = {};
    if (newName) updateData.name = newName;
    if (newDescription) updateData.description = newDescription;
    if (newPrice) updateData.price = newPrice;

    if (Object.keys(updateData).length === 0) {
        alert("No changes made.");
        return;
    }

    fetch(`/products/${productId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData) // Send only updated fields
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Product updated successfully!");
                fetchUserProducts(); // Refresh product list
            } else {
                alert("Failed to update product.");
            }
        })
        .catch(error => console.error('Error updating product:', error));
}
async function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        const response = await fetch(`/products/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            alert("Product deleted successfully!");
        } else {
            alert("Failed to delete product: " + data.message);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}


document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
        window.location.href = '/auth/login.html'; // Redirect to login after logout
    } catch (error) {
        console.error('Error logging out:', error);
    }
});

// Show update form
document.getElementById('update-btn').addEventListener('click', () => {
    document.getElementById('update-form').style.display = 'block';
});

// Handle update form submission
document.getElementById('update-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailNew').value;
    const username = document.getElementById('new-username').value;

    try {
        const response = await fetch('/auth/update-profile', {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Profile updated successfully');
            document.getElementById('username').textContent = username; // Update UI
            document.getElementById('update-form').style.display = 'none';
        } else {
            alert(data.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
    
});

fetchProfile(); // Load profile and products on page load