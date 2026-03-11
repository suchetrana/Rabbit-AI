# � Rabbitt AI — Sales Insight Automator

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-Llama_3.3-FF6600?style=for-the-badge" />
</p>

> Upload CSV/XLSX sales data → AI generates an intelligent summary → Email delivered to any recipient.

**Rabbitt AI** is a full-stack web application that uses AI (Groq Llama 3.3 70B) to analyze sales data and send a beautifully formatted report via email.

---

## ✨ Features

- **Drag & Drop Upload** — CSV/XLSX file upload with validation (MIME type + 10MB limit)
- **AI-Powered Analysis** — Groq Llama 3.3 70B generates key metrics, trends, insights & executive summary
- **Email Delivery** — Reports sent via Gmail SMTP (Nodemailer)
- **Dark/Light Mode** — Toggle with persistence to localStorage
- **Save Draft** — Form data auto-saved and restored from localStorage
- **Notifications** — In-app notification system for upload events
- **Page Navigation** — Dashboard, History, and API Docs pages
- **Swagger API Docs** — Interactive API documentation at `/api-docs`
- **Security** — Helmet, CORS, rate limiting, Zod validation

---

## 🗂️ Project Structure

```
Rabbit-AI/
├── frontend/                    # React + Vite + TypeScript + Tailwind CSS 4
│   ├── src/
│   │   ├── components/          # Sidebar, Header, UploadForm, FileDropzone, StatusBanner, History
│   │   ├── context/             # AppContext (page nav, dark mode, notifications)
│   │   ├── hooks/               # useUpload
│   │   ├── services/            # api.ts (Axios)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── .env.example
│
├── backend/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/              # env.ts (Zod-validated env vars)
│   │   ├── middlewares/         # helmet, rateLimiter, validate, errorHandler, upload (Multer)
│   │   ├── controllers/         # upload.controller.ts
│   │   ├── services/
│   │   │   ├── parser.service.ts    # CSV/XLSX → JSON (papaparse + xlsx)
│   │   │   ├── ai.service.ts        # Groq Llama 3.3 70B
│   │   │   └── mailer.service.ts    # Nodemailer + Gmail SMTP
│   │   ├── routes/              # upload.route.ts
│   │   ├── validators/          # Zod schemas
│   │   ├── docs/                # Swagger/OpenAPI spec
│   │   └── app.ts
│   ├── server.ts
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
├── .github/workflows/ci.yml
└── start.bat                    # Windows dev launcher
```

---

## 🚀 Live Demo

| Service  | URL |
|----------|-----|
| Frontend | _Deployed on Vercel_ |
| Backend  | _Deployed on Render_ |
| API Docs | `<backend-url>/api-docs` |

---

## ⚡ Quick Start (Local)

### Prerequisites

- Node.js 18+
- npm
- Gmail account with [App Password](https://myaccount.google.com/apppasswords)
- [Groq API Key](https://console.groq.com)

### 1. Clone

```bash
git clone https://github.com/suchetrana/Rabbit-AI.git
cd Rabbit-AI
```

### 2. Install dependencies

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
CORS_ORIGIN=http://localhost:5173
```

### 4. Run

**Windows:**
```bash
start.bat
```

**Manual:**
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Swagger: http://localhost:5000/api-docs

---

## 🐳 Docker

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Fill in your API keys

docker-compose up --build
```

---

## 🔒 Security

| Layer | Implementation |
|-------|---------------|
| HTTP Headers | Helmet (14 security headers) |
| Rate Limiting | 10 requests / 15 min per IP on `/api/upload` |
| File Validation | Multer — MIME whitelist + 10MB max |
| Input Validation | Zod schema on all inputs |
| CORS | Whitelist only frontend origin |
| Secrets | `.env` files, validated on startup |

---

## 🧠 AI Flow

```
User uploads CSV/XLSX + enters email
        ↓
Multer validates file (type + size)
        ↓
parser.service → CSV/XLSX parsed to JSON
        ↓
ai.service → Groq (Llama 3.3 70B) generates narrative summary
        ↓
mailer.service → Gmail SMTP sends HTML email
        ↓
Frontend shows success + renders AI summary
```

---

## 📡 API

### `POST /api/upload`

Upload a file and send AI analysis via email.

| Parameter | Type | Description |
|-----------|------|-------------|
| `file` | `File` | CSV or XLSX file (max 10MB) |
| `email` | `string` | Recipient email address |

**Response:**
```json
{
  "success": true,
  "message": "Report sent to user@example.com",
  "emailSent": true,
  "summary": "### Sales Analysis...",
  "summaryHtml": "<h3>Sales Analysis</h3>..."
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 7, TypeScript, Tailwind CSS 4 |
| Backend | Node.js, Express, TypeScript |
| AI | Groq SDK — Llama 3.3 70B Versatile |
| Email | Nodemailer + Gmail SMTP |
| File Parsing | PapaParse (CSV), SheetJS (XLSX) |
| Validation | Zod |
| API Docs | Swagger UI + swagger-jsdoc |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📋 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` / `production` |
| `GROQ_API_KEY` | Groq API key for Llama 3.3 |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password (16 chars) |
| `CORS_ORIGIN` | Allowed frontend URL |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (default: 900000) |
| `RATE_LIMIT_MAX` | Max requests per window (default: 10) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |

---

## 🚀 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| CI/CD | GitHub Actions (PR → lint + build) |

---

## 📝 License

MIT

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/suchetrana">suchetrana</a>
</p>
