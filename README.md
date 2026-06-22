# 🍽️ TasteHaven - Food Delivery Application

TasteHaven is a modern Full Stack Food Ordering Platform built using **React.js**, **Django REST Framework**, and **JWT Authentication**. It provides a seamless food ordering experience for customers along with a dedicated Admin Dashboard for monitoring orders and restaurant activities.

## Demo

* User Panel: http://localhost:3000
* Admin Panel: http://localhost:3000/admin

## Features

### User Panel

* Browse Restaurants
* View Restaurant Menus
* Add Items to Cart
* Update Cart Quantity
* Place Orders
* Order Confirmation
* Responsive UI Design

### Admin Panel

* Admin Login
* Dashboard Overview
* View Recent Orders
* Revenue Statistics
* Restaurant Statistics
* Menu Statistics
* Order Status Monitoring

### Authentication

* JWT Authentication
* Secure Login System
* Protected APIs
* Role-Based Access Control
* Admin Authorization

### Backend Features

* Django REST Framework APIs
* RESTful Architecture
* Order Management APIs
* Restaurant APIs
* User Authentication APIs
* MySQL Database Support

---

## 📸 Screenshots

### 📝 Registration Page

<img src="https://raw.githubusercontent.com/Sannihitha-gk/User-Registration-System/main/screenshots/register.png" width="900"/>

### 🔐 Login Page

<img src="https://raw.githubusercontent.com/Sannihitha-gk/User-Registration-System/main/screenshots/login.png" width="900"/>

### 👤 User Dashboard

<img src="https://raw.githubusercontent.com/Sannihitha-gk/User-Registration-System/main/screenshots/dashboard.png" width="900"/>

### ⚙️ Django Admin Panel

<img src="https://raw.githubusercontent.com/Sannihitha-gk/User-Registration-System/main/screenshots/admin.png" width="900"/>

### 🗄️ MySQL Database Tables

<img src="https://raw.githubusercontent.com/Sannihitha-gk/User-Registration-System/main/screenshots/database.png" width="900"/>

## Run Locally

Clone the repository

```bash
git clone https://github.com/Sannihitha-gk/TasteHaven-Food-Delivery.git
```

Go to the project directory

```bash
cd TasteHaven-Food-Delivery
```

---

## Backend Setup

Navigate to backend folder

```bash
cd backend
```

Create virtual environment

```bash
python -m venv venv
```

Activate virtual environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Apply migrations

```bash
python manage.py migrate
```

Create superuser

```bash
python manage.py createsuperuser
```

Start backend server

```bash
python manage.py runserver
```

Backend runs on:

```text
http://localhost:8000
```

---

## Frontend Setup

Navigate to frontend folder

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Start React application

```bash
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## API Configuration

Update API Base URL inside:

```javascript
src/services/api.js

const BASE = "http://localhost:8000/api";
```

---

## Admin Credentials

Demo Login

```text
Username: admin
Password: admin12345
```

For Django Admin

```text
http://localhost:8000/admin
```

Login using your Django superuser credentials.

## Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* CSS3
* HTML5

### Backend

* Django
* Django REST Framework
* Simple JWT

### Database

* MySQL

### Authentication

* JWT Authentication
* Role-Based Authorization

### Tools

* Git
* GitHub
* VS Code
* Postman

---

## Future Enhancements

* Online Payment Gateway Integration
* Order Tracking System
* Customer Profile Management
* Restaurant Management Panel
* Email Notifications
* Review & Rating System
* Docker Deployment

---

## Deployment

The project can be deployed using:

* Render
* Railway
* Vercel (Frontend)
* Netlify (Frontend)
* PythonAnywhere (Backend)

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

---

## Author

### Sannihitha Govulakonda

GitHub:
https://github.com/Sannihitha-gk

LinkedIn:
https://www.linkedin.com/in/sannihitha-govulakonda/

---

⭐ If you like this project, don't forget to star the repository.
# TasteHaven-Food-Delivery
