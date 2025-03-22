# GenAI Backend

This is the backend server for the GenAI application built with FastAPI.

## Project Structure

```
backend/
├── app/
│   ├── core/           # Core configurations
│   ├── models/         # Pydantic models
│   ├── routes/         # API routes
│   └── main.py         # Main application file
├── requirements.txt    # Project dependencies
└── README.md          # This file
```

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
python -m app.main
```

2. Using Uvicorn:
```bash
uvicorn app.main:app --reload
```

The server will start on `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## Available Endpoints

### General
- `GET /`: Welcome message and API information
- `GET /api/v1/health`: Health check endpoint with detailed status

### Syntentiser API
- `POST /api/v1/syntentiser/analyze`: Analyze sentiment of text
  - Request body: `{"text": "Your text here", "language": "en"}`
  - Returns: Sentiment analysis with confidence score and keywords
- `GET /api/v1/syntentiser/languages`: Get list of supported languages

## API Versioning

The API is versioned under the `/api/v1` prefix. All endpoints except the root and health check are prefixed with this path.

## Example Usage

### Sentiment Analysis
```bash
curl -X POST "http://localhost:8000/api/v1/syntentiser/analyze" \
     -H "Content-Type: application/json" \
     -d '{"text": "I love this product!", "language": "en"}'
```

### Get Supported Languages
```bash
curl "http://localhost:8000/api/v1/syntentiser/languages"
``` 