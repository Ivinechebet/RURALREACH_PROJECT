# RuralReach Project

RuralReach is a rural infrastructure monitoring and feedback platform that combines a React-based dashboard with a Flask backend supporting USSD and SMS workflows.

The repository includes:
- `infra-connect-dash-main/`: frontend dashboard built with React, Vite, Tailwind CSS, and shadcn UI components.
- `ruralreach/`: backend service for USSD navigation, SMS confirmation, MySQL storage, and API endpoints.

## Features

- Bilingual USSD experience: English and Kiswahili support.
- Project discovery by category, status, and location.
- Issue reporting with anonymous or phone-linked submissions.
- Project rating and feedback collection.
- SMS confirmation via Africa's Talking.
- Dashboard endpoints for projects, ratings, activity feed, and stats.
- Health check and database test endpoints.
- Local development and public tunneling support with ngrok.

## Repository structure

- `infra-connect-dash-main/`
  - React + TypeScript dashboard
  - Vite dev server and build scripts
  - Tailwind CSS + Radix UI components
- `ruralreach/`
  - `backend/`: Flask app, USSD handler, SMS handler, database connection, config
  - `database/`: database initialization and verification helpers
  - `tests/`: backend tests
  - `run.py`: Windows setup helper for dependencies and ngrok
  - `run_ngrok.py`: ngrok tunnel helper for public USSD callback URLs

## Tech stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, shadcn UI, Recharts
- Backend: Flask, MySQL Connector, Africa's Talking SDK, Flask-CORS
- Dev tools: npm, bun, ngrok, python virtualenv

## Installation

### Frontend

1. Open a terminal and navigate to the frontend folder:

```powershell
cd infra-connect-dash-main
```

2. Install dependencies:

```powershell
npm install
```

3. Start the development server:

```powershell
npm run dev
```

The dashboard should be available at the local Vite URL shown in the terminal, typically `http://localhost:5173`.

> Optional: Use `bun install` if you prefer Bun as the package manager.

### Backend

1. Open a terminal and navigate to the backend folder:

```powershell
cd ruralreach
```

2. Create and activate a Python virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install backend dependencies:

```powershell
python -m pip install -r backend/requirements.txt
```

> Note: `ruralreach/run.py` also installs `requests` and `flask-cors` if needed.

4. Configure environment variables by creating a `.env` file in `ruralreach/backend/` or exporting them directly.

Example `.env` values:

```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=#IVINEchebet3305
DB_NAME=ruralreach
DB_PORT=3307
AT_USERNAME=sandbox
AT_API_KEY=your_africastalking_api_key
FLASK_PORT=5000
USSD_CODE=*384*70840#
```

5. Start the Flask backend:

```powershell
python backend/app.py
```

The backend listens on `http://localhost:5000` by default.

### Optional ngrok setup

To expose the USSD endpoint publicly, use one of the helpers in `ruralreach/`.

```powershell
cd ruralreach
python run_ngrok.py
```

or on Windows:

```powershell
python run.py
```

Then configure Africa's Talking to use the public `https://<ngrok-id>.ngrok.app/ussd` callback URL.

## Usage

- Frontend dashboard: open the Vite URL from `infra-connect-dash-main`.
- Backend service: `http://localhost:5000`
- Health check: `http://localhost:5000/health`
- USSD endpoint: `http://localhost:5000/ussd`
- Dashboard API examples:
  - `/api/dashboard-stats`
  - `/api/ratings`
  - `/api/projects`
  - `/api/activities`

### USSD flow

Users can dial the configured USSD code and:
- View project updates by category
- Report issues with optional anonymity
- Rate projects and add comments
- View help instructions and SMS command guidance

### Africa's Talking

Update your Africa's Talking USSD service callback to point to the public tunnel URL plus `/ussd`. Use POST and configure the payload format according to Africa's Talking USSD settings.

## Notes

- The backend expects an existing MySQL database named `ruralreach` with tables used by the app.
- Default MySQL port is `3307`; override with `DB_PORT` if needed.
- The backend includes a bilingual USSD menu system and saves reports and ratings to MySQL.
- If you use `run.py`, it installs dependencies and can automatically try to start ngrok for Windows.

## Contact

For questions or improvements, open issues or add documentation to this README.
