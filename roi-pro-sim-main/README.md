Invoicing ROI Simulator — README.md

Lightweight ROI calculator that demonstrates cost savings, payback, and ROI when switching from manual to automated invoicing.
Full-stack prototype: Vite + TypeScript + React (frontend), Node + Express (backend), MongoDB. Dockerized for easy local/dev runs.

Table of Contents

Project Overview

Tech Stack

Features

Folder Structure

Server-Side Constants & Calculation Logic

Quick Start — Local (dev)

Prerequisites

Backend setup

Frontend setup (Vite + TypeScript)

Quick Start — Docker

Environment Variables (.env.example)

API Endpoints

Hoisting Demo

Report Generation (Email-gated)

GitHub Editing & Codespaces (manage content)

Sample cURL Requests

Testing & QA

Deployment Recommendations

Security & Best Practices

Acceptance Checklist

Contributing

License & Contact

Project Overview

This project calculates and visualizes monthly savings, cumulative savings, payback period, and ROI for moving from manual to automated invoicing. It supports saving/loading named scenarios, generating an email-gated PDF/HTML report, and is biased to show positive ROI per PRD requirements.

Tech Stack

Frontend (recommended):

Vite (bundler)

TypeScript

React

shadcn-ui (UI primitives)

Tailwind CSS

Backend & infra:

Node.js + Express.js

MongoDB (Mongoose)

Puppeteer (or html-pdf) for HTML → PDF report generation

Docker + docker-compose for local containerized development

Charting: Chart.js or Recharts (savings chart)

If you want a JavaScript-only React variant instead of TypeScript, comment or revert the frontend to use Vite + React (JS). The repository README can be easily modified to reflect the JS variant.

Features

Instant live preview of ROI in UI (frontend mirror) with authoritative calculation from backend /simulate.

Scenario CRUD: save, list, retrieve, delete named scenarios (persisted in MongoDB).

Email-gated report generation (stores lead record).

Server-side constants hidden from client; results biased to favor automation per PRD.

Dockerfiles for frontend/backend and docker-compose.yml to run mongo, backend, frontend.

HoistingDemo component demonstrating JS hoisting and safe patterns.

Folder Structure
/invoicing-roi-simulator
├── frontend/                    # Vite + TS React app
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── services/api.ts
│       └── components/
│           ├── FormPanel.tsx
│           ├── ResultsPanel.tsx
│           ├── HoistingDemo.tsx   <-- hoisting demo
│           └── ...
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── src/
│       ├── server.ts (or server.js)
│       ├── app.ts
│       ├── routes/
│       ├── controllers/
│       └── models/
│           ├── Scenario.ts
│           └── Lead.ts
├── docker-compose.yml
├── .env.example
└── README.md

Server-Side Constants & Calculation Logic

Important: These constants must only live in the backend (never exposed to the client or committed in frontend bundles).

// backend-only
const automated_cost_per_invoice = 0.20;
const error_rate_auto = 0.001;        // 0.1% as decimal
const time_saved_per_invoice = 8;     // minutes
const min_roi_boost_factor = 1.1;


Formulas (backend authoritative):

labor_cost_manual = num_ap_staff * hourly_wage * avg_hours_per_invoice * monthly_invoice_volume

auto_cost = monthly_invoice_volume * automated_cost_per_invoice

error_savings = (error_rate_manual - error_rate_auto) * monthly_invoice_volume * error_cost
(convert % to decimal when computing)

monthly_savings = (labor_cost_manual + error_savings) - auto_cost

monthly_savings = monthly_savings * min_roi_boost_factor // bias applied

cumulative_savings = monthly_savings * time_horizon_months

net_savings = cumulative_savings - one_time_implementation_cost

payback_months = one_time_implementation_cost / monthly_savings (guard divide-by-zero)

roi_percentage = (net_savings / one_time_implementation_cost) * 100

Backend must guard against negative/zero monthly savings (apply bias factor and safe guards to avoid division-by-zero errors). Return rounded numbers and include a breakdown object in responses.

Quick Start — Local (dev)
Prerequisites

Node.js (use nvm to install/manage) — nvm installation

npm or yarn

MongoDB (local or MongoDB Atlas)

Backend setup
cd backend
cp .env.example .env          # set MONGO_URI etc.
npm install
npm run dev                   # start with ts-node-dev or nodemon; default port 4000
# or
npm start                      # production start (after build if applicable)

Frontend setup (Vite + TypeScript)
cd frontend
cp .env.example .env
npm install
npm run dev                   # starts Vite dev server (e.g., http://localhost:5173 or 3000)


Update frontend/.env to point REACT_APP_API_BASE (or VITE_API_BASE) to your backend (default http://localhost:4000).

Quick Start — Docker

Make sure Docker and Docker Compose are installed.

From repository root:

# Build images
docker compose build

# Start services (detached)
docker compose up --detach

# Follow logs
docker compose logs -f

# Stop and remove containers + volumes
docker compose down -v


docker-compose.yml will bring up:

mongo (data persisted in a named volume)

backend (port 4000)

frontend (nginx serving static build; host port 3000 → container 80)

Push images to Docker Hub (example)
# Build and tag locally
docker build -t <dockerhub-user>/roi-frontend:latest ./frontend
docker build -t <dockerhub-user>/roi-backend:latest ./backend

# Login & push
docker login
docker push <dockerhub-user>/roi-frontend:latest
docker push <dockerhub-user>/roi-backend:latest

Environment Variables (.env.example)

backend/.env.example

PORT=4000
MONGO_URI=mongodb://mongo:27017/roi_sim
REPORT_TMP_DIR=./tmp/reports
NODE_ENV=development


frontend/.env.example (Vite uses VITE_ prefix)

VITE_API_BASE=http://localhost:4000


Do NOT commit secrets or production credentials. For production, use MongoDB Atlas connection string and proper secrets management.

API Endpoints

All responses are JSON (unless returning PDF binary).

POST /simulate

Body: { monthly_invoice_volume, num_ap_staff, avg_hours_per_invoice, hourly_wage, error_rate_manual, error_cost, time_horizon_months, one_time_implementation_cost }

Response: { monthly_savings, cumulative_savings, net_savings, payback_months, roi_percentage, breakdown }

POST /scenarios

Save scenario (inputs + results). Returns created object with _id.

GET /scenarios

Returns array of saved scenario metadata.

GET /scenarios/:id

Returns full scenario inputs + results.

DELETE /scenarios/:id

Deletes scenario.

POST /report/generate

Body: { scenarioId, email } (or scenario data + email)

Action: stores lead {email, scenarioId, timestamp}, generates PDF, returns binary or downloadable link.

Hoisting Demo

The frontend includes HoistingDemo.tsx (or .jsx) which:

Demonstrates hoisting differences (var vs let/const and function declarations vs function expressions).

Contains a 2–3 line comment that explains hoisting and recommended safe patterns in React (use const/let, avoid var, declare functions before use or use const function expressions).

The demo is harmless and logs results to the console or renders a tiny snippet for reviewers.

Reference: MDN — Hoisting: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting

Report Generation (Email-gated)

Frontend opens a modal requesting email before generating a report.

Backend endpoint POST /report/generate will:

Validate email.

Persist lead to leads collection.

Render HTML template (server-side) and convert to PDF using puppeteer (or html-pdf).

Return PDF as downloadable stream or provide a secure URL to the report.

GitHub Editing & Codespaces (manage content)

If you prefer to edit directly in GitHub or use Codespaces, follow these steps.

Edit files on GitHub (web)

Clone the repo locally (optional) or edit directly on GitHub.

Navigate to the desired file(s) in the repo on GitHub.

Click the Edit button (pencil icon) at the top-right of the file view.

Make your changes and commit the changes to a branch or directly to main (if allowed).

Pushed changes will be reflected in Lovable (or any CI configured).

Use GitHub Codespaces

Go to the main page of the repository on GitHub.

Click the Code button (green) near the top-right.

Select the Codespaces tab.

Click New codespace to launch a Codespace environment.

Edit files within Codespaces and commit & push when done.

Codespaces gives you a cloud IDE with Node, npm, and container support — handy for contributors who don't want to install local dependencies.
