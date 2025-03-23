from fastapi import FastAPI, HTTPException, Query, Body, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import texttospeech
from fastapi.responses import FileResponse
import os

app = FastAPI(
    title="GenAI Backend",
    description="Backend server for GenAI application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GENDER_MAP = {
    "Artistic Aria": "female",
    "Rhyme Rex": "male", 
    "Logic Leo": "male",
    "Thinking Ponder": "male",
    "Dramatic Delilah": "female",
    "Shadow Sam": "male",
    "Teacher": "female"
}

@app.get("/")
async def root():
    return {"message": "Welcome to GenAI Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/synthesize")
async def synthesize_speech(request: Request):
    try:
        body = await request.json()
        text = body.get("text")
        agent_name = body.get("agent_name")
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")

        client = texttospeech.TextToSpeechClient()
        
        input_text = texttospeech.SynthesisInput(text=text)
        
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            name="en-US-Studio-O" if agent_name == "Teacher" else "en-US-Studio-M",
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=1
        )

        response = client.synthesize_speech(
            input=input_text,
            voice=voice,
            audio_config=audio_config
        )

        # Save the audio file temporarily
        output_file = "temp_output.mp3"
        with open(output_file, "wb") as out:
            out.write(response.audio_content)
        
        # Return the audio file
        return FileResponse(
            output_file,
            media_type="audio/mp3",
            filename="speech.mp3"
        )
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)