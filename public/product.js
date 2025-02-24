document.addEventListener('DOMContentLoaded', async () => {
    const productDetails = document.getElementById('product-details');

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        productDetails.innerHTML = "<p style='color: red;'>Product not found.</p>";
        return;
    }

    try {
        const response = await fetch(`/products/${productId}`);
        const product = await response.json();

        if (!product) {
            productDetails.innerHTML = "<p style='color: red;'>Product not found.</p>";
            return;
        }

        productDetails.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: white; max-width: 400px; margin: auto; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
                <img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 5px; margin-bottom: 10px;">
                <h2 style="margin: 10px 0;">${product.name}</h2>
                <p style="color: #555;">${product.description}</p>
                <p style="font-weight: bold; font-size: 18px;">$${product.price}</p>
                <button onclick="addToCart('${product._id}')" style="padding: 10px 15px; font-size: 16px; border: none; background-color: #28a745; color: white; cursor: pointer; border-radius: 5px; margin-top: 10px;">
                    Add to Cart
                </button>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetails.innerHTML = "<p style='color: red;'>Failed to load product details.</p>";
    }
});
function showPopup(message) {
    let popup = document.getElementById('popup-message');

    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'popup-message';
        popup.style.position = 'fixed';
        popup.style.bottom = '20px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = 'black';
        popup.style.color = 'white';
        popup.style.padding = '10px 20px';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
        popup.style.transition = 'opacity 0.5s ease';
        document.body.appendChild(popup);
    }

    popup.textContent = message;
    popup.style.opacity = '1';

    setTimeout(() => {
        popup.style.opacity = '0';
    }, 2000); // Hide after 2 seconds
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    showPopup("Product added to cart!");
}
