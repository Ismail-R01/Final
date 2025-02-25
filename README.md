# Product Marketplace Website

## Overview
This is a fully functional e-commerce website that allows users to browse products, view details, manage their profile, and put their own products for sale. It includes authentication, product management, and an improved UI with dynamic interactions.

## Features
- **User Authentication**: Login, logout, and profile management.
- **Product Listing**: View available products with images and descriptions.
- **Product Details**: See detailed product information on a separate page.
- **Product Management**: Create, update, and delete products (for admin users).

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Javascript - NodeJS, Express
- **Database**: MongoDB 
- **Authentication**: Session-based auth with cookies

## Installation & Setup
### Prerequisites
- Node.js installed
- MongoDB running

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Ismail-R01/Final
   cd final-master
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `localhost:3000` in your browser.

## API Endpoints
- **Authentication**
  - `GET /auth/check-auth` → Check if user is logged in
  - `POST /auth/login` → User login
  - `POST /auth/logout` → User logout

- **Products**
  - `GET /api/products` → Fetch all products
  - `GET /products/:id` → Fetch product details
  - `POST /products` → Add a new product
  - `PUT /products/:id` → Update product
  - `DELETE /products/:id` → Delete product

## To-Do
- Add and imrpove shopping cart UI and functionality
- Enhance product update/delete button styling
- Implement better notifications instead of alert popups

## Contributing
Feel free to fork this repository and submit pull requests!



