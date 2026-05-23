# HairCare E-Commerce Platform

A comprehensive, full-stack e-commerce platform dedicated to haircare products. The project features a premium dynamic UI with user and admin portals, secure authentication, product browsing, dynamic reviews, shopping cart, checkout, payment processing via Razorpay, and a complete administrative dashboard for managing users, products, brands, and orders.

## Project Architecture

This repository is organized into three main directories, representing the microservice architecture of the application:

- **`Frontend/` (Client Application):** The main customer-facing web application.
- **`Admin/` (Admin Dashboard):** A dedicated portal for store administrators to manage the platform.
- **`backend/` (API Service):** The Node.js/Express server that powers both the frontend and admin interfaces, handling business logic, database interactions, and integrations.

## Tech Stack

### Frontend (User Portal)
- **Framework:** React 18 with Vite
- **Styling & UI Components:** Bootstrap 5, Material-UI (MUI), Hover.css
- **Animations:** Framer Motion, AOS (Animate On Scroll), Canvas Confetti
- **State & Routing:** React Router DOM
- **Utilities:** Axios, SweetAlert2, React Toastify, Swiper, Drift Zoom

### Admin (Management Portal)
- **Framework:** React 19 with Vite
- **Styling & UI Components:** Bootstrap 5, Material-UI (MUI)
- **Animations:** GSAP, Framer Motion, AOS
- **Data Visualization:** Recharts
- **State & Routing:** React Router DOM
- **Utilities:** Axios, SweetAlert2, React Toastify

### Backend (API & Database)
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcrypt/bcryptjs
- **File Uploads:** Multer
- **Payment Gateway:** Razorpay
- **Email Services:** Nodemailer
- **API Documentation:** Swagger (swagger-jsdoc, swagger-ui-express)

## Features

### User Experience
- **Responsive Premium Design:** Optimized for all devices with dynamic animations and modern typography.
- **Product Discovery:** Browse products by categories, search, and detailed product pages with zoom capabilities.
- **Authentication:** Secure user registration, login, and profile management.
- **Cart & Checkout:** Seamless shopping cart experience with cash and online (Razorpay) payment options.
- **Dynamic Reviews:** Users can leave ratings and reviews on products.
- **Order Tracking:** Users can view their order history and status.

### Administrator Experience
- **Dashboard Overview:** Visual representation of platform statistics using charts (Recharts).
- **Product Management:** Full CRUD capabilities for haircare products, including image uploads.
- **Order Management:** View order details, update payment statuses, and track fulfillment.
- **User & Brand Management:** Manage registered users and maintain brand listings.
- **Review Moderation:** Monitor and manage product reviews.

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd HAIRCARE
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with your MongoDB URI, JWT Secret, Razorpay keys, and SMTP details
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   # Create a .env file with your VITE_API_URL and Razorpay public key if needed
   npm run dev
   ```

4. **Admin Setup:**
   ```bash
   cd Admin
   npm install
   # Create a .env file with your VITE_API_URL
   npm run dev
   ```

## Development Servers
By default, the development environments will start on:
- **Backend:** Usually `http://localhost:5000` or the port specified in `.env`
- **Frontend:** `http://localhost:5173` (Vite default)
- **Admin:** `http://localhost:5174` (Vite default)
