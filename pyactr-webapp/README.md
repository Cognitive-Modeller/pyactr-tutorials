# pyactr-webapp

Browser-based interface for running pyactr code alongside the tutorial content. Built with React/TypeScript on the frontend and FastAPI on the backend.

## Running it

### Docker

```bash
docker-compose up
```

Frontend at http://localhost:3000, API at http://localhost:8000.

### Manual

Backend:
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173.

## Structure

```
pyactr-webapp/
  frontend/          React + Vite + Tailwind + Monaco editor
  backend/           FastAPI, runs pyactr in subprocesses
  scripts/           Notebook-to-content converter
  docker-compose.yml
```

## API

- `POST /api/execute` -- run Python code, returns stdout/stderr
- `GET /api/health` -- check if pyactr is importable

Code is executed in a subprocess with a 10s timeout.

## Updating tutorial content

```bash
cd scripts
python convert_notebooks.py
```
