# GenAI Backend

This is the backend server for the GenAI application built with FastAPI.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

You can run the server in two ways:

1. Using Python directly:
```bash
python main.py
```

2. Using Uvicorn:
```bash
uvicorn main:app --reload
```

The server will start on `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## Available Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint 