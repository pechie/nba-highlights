# NBA Highlights Generator

Generates a compiled MP4 highlight reel for a specific NBA player in a specific game. Select a date, pick a game, pick a player, choose stat types (field goals, rebounds, etc.), and watch the reel in your browser.

## Requirements

- Python 3.12+
- Node.js 18+
- ffmpeg (`sudo apt install -y ffmpeg` on Ubuntu/Debian)

## Setup

**Backend:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

## Running

**Backend** (port 8000):
```bash
cd backend && source .venv/bin/activate && uvicorn main:app --reload
```

**Frontend** (port 5173):
```bash
cd frontend && npm run dev
```

Then open http://localhost:5173.

## Running Tests

**Backend:**
```bash
cd backend && source .venv/bin/activate && pytest
```

**Frontend:**
```bash
cd frontend && npm test
```
