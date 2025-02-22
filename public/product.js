document.addEventListener('DOMContentLoaded', async () => {
    const productDetails = document.getElementById('product-details');

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        productDetails.innerHTML = "<p>Product not found.</p>";
        return;
    }

    try {
        const response = await fetch(`/products/${productId}`);
        const product = await response.json();

        if (!product) {
            productDetails.innerHTML = "<p>Product not found.</p>";
            return;
        }

        productDetails.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p class="price">$${product.price}</p>
            <button onclick="addToCart('${product._id}')">Add to Cart</button>
        `;
    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetails.innerHTML = "<p>Failed to load product details.</p>";
    }
});

function addToCart(productId) {
    alert(`Product ${productId} added to cart!`);
}
