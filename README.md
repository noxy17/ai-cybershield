# AI CyberShield

AI CyberShield is a production-shaped full-stack SaaS platform for real-time phishing, scam, malicious URL, and social engineering detection.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios, React Query, Recharts, Lottie
- Backend: Django, Django REST Framework, Simple JWT
- Database: MongoDB via MongoEngine
- ML: scikit-learn TF-IDF + Logistic Regression with explainable risk signals
- Ops: Docker Compose, Nginx reverse proxy, GitHub Actions

## Quick Start

```bash
docker compose up --build
```

Frontend: http://localhost:5173  
Backend API: http://localhost:8000/api/v1/

## Local Development

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

```bash
cd frontend
npm install
npm run dev
```

## API

- `POST /api/v1/auth/register/`
- `POST /api/v1/auth/login/`
- `POST /api/v1/auth/forgot-password/`
- `POST /api/v1/auth/verify-email/`
- `POST /api/v1/predict/`
- `POST /api/v1/explain/`
- `GET /api/v1/history/`
- `GET /api/v1/analytics/`
- `GET /api/v1/users/`

## Notes

The bundled ML service trains a compact baseline model on curated examples at startup and combines it with transparent cybersecurity rules for explainability. Replace `backend/ml/phishing_model.py` training data with a larger corpus or persisted model artifact for higher real-world accuracy.
