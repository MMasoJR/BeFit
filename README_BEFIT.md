# 💪 BeFit — AI-Powered Gym Management System

![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange?style=flat-square&logo=google)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-red?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)

> Full-stack gym management platform with AI-powered workout recommendations via Google Gemini, secure JWT authentication, and a modern Next.js/TypeScript frontend.

---

## 🎯 Features

- 🔐 **Secure Authentication** — JWT tokens + bcrypt password hashing
- 🤖 **AI Workout Assistant** — Google Gemini integration for personalized training plans
- 📋 **Member Management** — Full CRUD for gym members, plans, and sessions
- 📊 **Admin Dashboard** — Real-time overview of members, check-ins, and performance metrics
- 📱 **Responsive UI** — Modern Next.js frontend with Tailwind CSS v3

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────┐
│     Next.js 14 Frontend                  │
│     React + TypeScript + Tailwind CSS    │
└───────────────────┬──────────────────────┘
                    │ REST API (HTTP/JSON)
┌───────────────────▼──────────────────────┐
│     FastAPI Backend (Python)             │
│     JWT Auth · Pydantic · SQLAlchemy     │
└──────────┬──────────────────┬────────────┘
           │                  │
┌──────────▼───────┐ ┌────────▼────────────┐
│   PostgreSQL DB  │ │  Google Gemini API  │
│   (User Data)    │ │  (AI Workouts)      │
└──────────────────┘ └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | REST API framework |
| Python 3.10+ | Language |
| JWT (python-jose) | Token-based authentication |
| bcrypt (passlib) | Password security |
| Pydantic Settings | Configuration and validation |
| SQLAlchemy | ORM / database layer |

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework (App Router) |
| TypeScript | Type safety across the app |
| Tailwind CSS 3.4 | Utility-first styling |
| React Hook Form | Form management |

### AI
| Technology | Purpose |
|-----------|---------|
| Google Gemini API | Personalized workout generation |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Google Gemini API Key ([get one here](https://ai.google.dev))

### Backend

```bash
# Clone the repository
git clone https://github.com/yourusername/befit.git
cd befit/backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate      # Windows (PowerShell)
source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add:
# GEMINI_API_KEY=your_key_here
# JWT_SECRET=your_secret_here
# DATABASE_URL=sqlite:///./befit.db

# Start the server
uvicorn main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Frontend

```bash
cd befit/frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local and add:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the development server
npm run dev
# App available at http://localhost:3000
```

---

## 📁 Project Structure

```
befit/
├── backend/
│   ├── routers/            # API route handlers (auth, members, workouts)
│   ├── models/             # SQLAlchemy database models
│   ├── schemas/            # Pydantic request/response schemas
│   ├── services/           # Business logic + Gemini AI integration
│   ├── auth/               # JWT token generation and validation
│   ├── config.py           # Pydantic Settings configuration
│   ├── database.py         # SQLAlchemy session setup
│   └── main.py             # FastAPI app entrypoint
│
└── frontend/
    ├── app/                # Next.js App Router pages
    ├── components/         # Reusable React components
    │   ├── ui/             # Base UI components
    │   ├── members/        # Member management components
    │   └── dashboard/      # Dashboard widgets
    ├── lib/                # API client, utilities, helpers
    ├── types/              # TypeScript type definitions
    └── next.config.js
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/members` | List all members |
| POST | `/members` | Create new member |
| PUT | `/members/{id}` | Update member data |
| DELETE | `/members/{id}` | Remove member |
| POST | `/ai/workout` | Generate AI workout plan (Gemini) |

---

## 👨‍💻 Author

**Marcelo Maso**
AI Developer | FIAP — Tecnólogo em Inteligência Artificial
[LinkedIn](https://linkedin.com/in/yourusername) · [GitHub](https://github.com/yourusername)

---

*Full-stack production-ready project | FIAP 2025*
