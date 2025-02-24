document.getElementById('addProductForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent page reload

    const formData = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        imageUrl: document.getElementById('imageUrl').value
    };

    try {
        const response = await fetch('/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // To send cookies (for authentication)
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();

        if (response.ok) {
            alert('Product added successfully!');
            window.location.href = '/'; // Redirect to home page
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('An error occurred. Please try again.');
    }
});
