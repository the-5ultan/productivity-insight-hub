<div align="center">

```
████████╗███████╗ ██████╗██╗  ██╗██╗  ██╗   ██╗████████╗██╗ ██████╗███████╗
╚══██╔══╝██╔════╝██╔════╝██║  ██║██║  ╚██╗ ██╔╝╚══██╔══╝██║██╔════╝██╔════╝
   ██║   █████╗  ██║     ███████║██║   ╚████╔╝    ██║   ██║██║     ███████╗
   ██║   ██╔══╝  ██║     ██╔══██║██║    ╚██╔╝     ██║   ██║██║     ╚════██║
   ██║   ███████╗╚██████╗██║  ██║███████╗██║       ██║   ██║╚██████╗███████║
   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝       ╚═╝   ╚═╝ ╚═════╝╚══════╝
```

**Smart Technology Usage & Productivity Analysis System**

*Turn raw behavioral data into research-grade insights — no statistics degree required.*

[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Architecture](#-architecture) · [API Docs](#-api-reference) · [Screenshots](#-screenshots)

</div>

---

## 🔬 What is Techlytics?

Techlytics is a **full-stack research analytics platform** built for students and academic researchers who want to understand the relationship between digital habits and academic productivity — without drowning in SPSS or R.

Upload a CSV, click **Analyze**, and get a complete statistical breakdown in seconds: correlation matrices, regression models, probability distributions, MCDA rankings, and publication-ready PDF/Excel reports.

> *"Existing tools are either too generic (Excel), too complex (SPSS/R), or not tailored to this research domain. Techlytics bridges that gap."*

---

## ✨ Features

### 📊 Statistical Analysis Engine
- **Descriptive Statistics** — Mean, median, mode, variance, standard deviation, min/max/range for every variable
- **Pearson Correlation Matrix** — Full N×N correlation between all numeric fields with strength interpretation (weak / moderate / strong)
- **Simple Linear Regression** — Study time → Productivity prediction with least-squares slope/intercept
- **Empirical Probability** — Likelihood of high (≥7) and low (≤4) productivity outcomes
- **Variable Removal Impact** — Simulates removing social media to reveal its masking effect on other variables
- **Weighted Productivity Index** — `(Study × 0.4) + (Sleep × 0.3) − (Social × 0.2) − (Screen × 0.1)`
- **MCDA Rankings** — Top-3 student ranking using multi-criteria decision analysis

### 📁 Data Ingestion
- **File Upload** — Drag-and-drop CSV or XLSX/XLS (up to 10 MB) with smart header aliasing
- **Manual Entry** — Spreadsheet-like row editor for direct data input
- **Multi-Dataset Comparison** — Cross-population correlation across 2+ datasets simultaneously

### 📄 Report Generation
- **PDF Reports** — 9-section A4 document (cover, raw data, stats, correlation, regression, probability, MCDA, visualizations, AI summary)
- **Excel Reports** — 10-sheet workbook with the same content in structured column layout

### 🔐 Authentication
- Email registration with **6-digit OTP** verification (5-min expiry)
- **Google OAuth 2.0** via Passport.js
- JWT access + refresh tokens, role-based access control (user / admin)
- Rate limiting: 5 OTP/hr · 100 API requests/15 min

### 🎨 UI/UX
- Dark-theme **glass-morphism** dashboard
- Recharts visualizations: scatter plots with regression lines, bar charts, correlation heatmaps
- Particle network animated landing page
- Admin dashboard with user management and system statistics

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + Vite | 19.2.6 / 8.0.12 |
| **Styling** | Tailwind CSS | 4.3.0 |
| **Animations** | Framer Motion | 12.40.0 |
| **Charts** | Recharts | 3.8.1 |
| **Backend** | Node.js + Express | 5.2.1 |
| **Database** | MySQL 8.0 + Sequelize | 6.37.8 |
| **Auth** | Passport.js + JWT + bcryptjs | — |
| **File Upload** | Multer + csv-parser + xlsx | — |
| **PDF Reports** | PDFKit | — |
| **Excel Reports** | ExcelJS | — |
| **Email** | Nodemailer (Gmail SMTP) | — |
| **DevOps** | Docker + docker-compose | — |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0
- Docker & Docker Compose (optional but recommended)

### Option A — Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/the-5ultan/productivity-insight-hub.git
cd techlytics

# 2. Copy and fill in environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your DB credentials, JWT secrets, Gmail SMTP, and Google OAuth keys

# 3. Start all services (MySQL + Backend + Frontend)
docker-compose up --build

# Frontend → http://localhost:5173
# Backend  → http://localhost:5000
```

### Option B — Manual Setup

```bash
# --- Backend ---
cd backend
npm install
# Configure backend/.env (see below)
npm run dev          # starts with nodemon on :5000

# --- Frontend ---
cd ../frontend
npm install
npm run dev          # starts Vite dev server on :5173
```

### Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=techlytics
DB_USER=root
DB_PASSWORD=yourpassword

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Session
SESSION_SECRET=your_session_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Gmail SMTP
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React 19 Frontend                        │
│  LandingPage → AuthModal → Dashboard → Analysis → Reports   │
│  Recharts · Framer Motion · Axios interceptors · Context     │
└─────────────────────┬───────────────────────────────────────┘
                      │  REST API (JSON)
┌─────────────────────▼───────────────────────────────────────┐
│                   Express 5 Backend                          │
│  CORS → Session → Passport → Rate Limit → Routes            │
│  Controllers → Services → StatisticsEngine                  │
│  PDFKit · ExcelJS · Nodemailer · Multer                      │
└─────────────────────┬───────────────────────────────────────┘
                      │  Sequelize ORM
┌─────────────────────▼───────────────────────────────────────┐
│                    MySQL 8.0 Database                        │
│  User · UserProfile · Dataset · DatasetRecord               │
│  Analysis · Report · OtpVerification · ActivityLog          │
└─────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
techlytics/
├── backend/
│   ├── config/          # DB, mail, multer, passport
│   ├── controllers/     # Auth, Dataset, Analysis, Report, Admin
│   ├── services/        # Business logic layer
│   ├── models/          # Sequelize models + associations
│   ├── middleware/       # auth, admin, rateLimiter, errorHandler
│   ├── routes/          # Express route definitions
│   ├── statistics/      # StatisticsEngine class (core math)
│   ├── utils/           # JWT helpers, OTP generator
│   ├── reports/         # Generated PDF/Excel output
│   └── uploads/         # User-uploaded CSV/XLSX files
│
└── frontend/
    ├── src/
    │   ├── pages/       # Dashboard, Datasets, Analysis, Reports…
    │   ├── components/  # Navbar, Sidebar, AuthModal, Charts…
    │   ├── context/     # AuthContext
    │   ├── services/    # Axios API client
    │   └── layouts/     # DashboardLayout
    └── public/
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register with name, email, password |
| `POST` | `/api/auth/verify-otp` | Verify email with 6-digit OTP |
| `POST` | `/api/auth/login` | Login → returns JWT tokens |
| `POST` | `/api/auth/forgot-password` | Send password reset OTP |
| `POST` | `/api/auth/reset-password` | Reset password with OTP |
| `GET`  | `/api/auth/google` | Initiate Google OAuth |
| `GET`  | `/api/auth/google/callback` | Google OAuth callback |

### Datasets
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/datasets/upload` | Upload CSV/XLSX file |
| `POST` | `/api/datasets/manual` | Manual record entry |
| `GET`  | `/api/datasets` | List user datasets |
| `GET`  | `/api/datasets/:id` | Get dataset with all records |
| `DELETE` | `/api/datasets/:id` | Delete dataset + cascade records |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analysis/run` | Full statistical analysis |
| `GET`  | `/api/analysis/analyze/:datasetId` | Same via GET |
| `POST` | `/api/analysis/compare-multi` | Compare 2+ datasets |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/reports/pdf/:datasetId` | Generate & download PDF |
| `POST` | `/api/reports/excel/:datasetId` | Generate & download XLSX |
| `GET`  | `/api/reports` | List generated reports |
| `GET`  | `/api/reports/download/:reportId` | Re-download a report |

> All protected routes require `Authorization: Bearer <token>` header.

---

## 🧮 Algorithms Implemented

All statistical logic lives in `backend/statistics/index.js` — no external ML libraries.

| Algorithm | Formula | Complexity |
|-----------|---------|------------|
| Mean | `Σx / n` | O(n) |
| Median | Sort → middle value | O(n log n) |
| Mode | Frequency map | O(n) |
| Variance | `Σ(xi − x̄)² / n` | O(n) |
| Pearson Correlation | `Σ((xi−x̄)(yi−ȳ)) / √(Σ(xi−x̄)²·Σ(yi−ȳ)²)` | O(n) |
| Linear Regression | Least squares: `m = Σ((xi−x̄)(yi−ȳ)) / Σ(xi−x̄)²` | O(n) |
| Empirical Probability | `count(condition) / n` | O(n) |
| Weighted Index | `0.4·study + 0.3·sleep − 0.2·social − 0.1·screen` | O(n) |
| MCDA Score | `2·study + sleep − social` → sort descending | O(n log n) |

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Guest** | Landing page only |
| **User** | Full analysis pipeline, own datasets & reports |
| **Admin** | All user data, system statistics, activity logs |

---

## 🗺 Roadmap

- [ ] Multivariate regression (multiple independent variables)
- [ ] Real ML-based productivity prediction (TensorFlow.js)
- [ ] User-configurable MCDA weights
- [ ] Hypothesis testing (t-test, ANOVA, chi-square)
- [ ] Time series / trend analysis
- [ ] Forgot/reset password frontend UI
- [ ] TypeScript migration
- [ ] Automated test suite (Jest + Vitest)
- [ ] OpenAPI / Swagger documentation
- [ ] CI/CD pipeline
- [ ] Cloud storage for reports (AWS S3)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss major changes.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ for the academic research community

*Techlytics — because your data deserves better than a spreadsheet.*

</div>
