# Pisska 🍽️

A modern restaurant ordering application built with **React Native, Expo, TypeScript, and Django REST Framework**.

Pisska is a portfolio project designed to demonstrate mobile application development, API integration, authentication, and backend development using modern technologies.

## ✨ Features

- Browse food items and restaurant menus.
- Explore food categories.
- Search for food items.
- View food and restaurant details.
- Manage shopping cart items.
- User authentication and account management.
- Place and manage food orders.
- Backend API integration.
- Persistent cart and order state management.

## 🛠️ Tech Stack

### Frontend

- React Native
- Expo
- TypeScript
- Expo Router
- Zustand
- TanStack Query
- Lucide React Native

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- SQLite

## 📁 Project Structure

```text
Pisska/
├── app/                  # Application screens and navigation
├── assets/               # Fonts, images, and sounds
├── components/           # Reusable UI components
├── constants/            # Colors, spacing, and typography
├── contexts/             # React contexts
├── data/                 # Local application data
├── lib/                  # Shared libraries and providers
├── services/             # API and application services
├── store/                # Zustand state management
├── backend/              # Django backend
│   ├── config/
│   ├── foods/
│   ├── users/
│   ├── accounts/
│   └── manage.py
└── postman/              # API collections and documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Python 3.12+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/shayantaghipour/Pisska.git
cd Pisska
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the backend

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a Python virtual environment, then install the dependencies:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install requirements:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
```

Run database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

### 4. Start the frontend

Open another terminal in the project root:

```bash
npx expo start
```

Follow the Expo CLI instructions to run the application on a supported device or emulator.

## 📸 Screenshots

Screenshots of the application will be added here.

## 📌 Project Status

**Version:** 1.0.0

Pisska is a portfolio and learning project. Its main goal is to demonstrate frontend and backend development skills through a restaurant ordering application.

## 📄 License

This project is available for educational and portfolio purposes.
