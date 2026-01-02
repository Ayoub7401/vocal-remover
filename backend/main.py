from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import shutil
# Adjust import for Docker structure where we run from root
try:
    from backend.services.audio_processor import AudioProcessor
except ImportError:
    from services.audio_processor import AudioProcessor

app = FastAPI(title="Instrumental Converter API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services
processor = AudioProcessor(upload_dir="/tmp", output_dir="/tmp")

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/upload") # Keep original path for simplicity, or move to /api/upload
async def upload_audio(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    try:
        # Save uploaded file
        file_location = f"temp/{file.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Process audio
        # Note: In a real app, send this to a background worker (Celery/RQ)
        # Here we do it synchronously or via background_tasks if we want to return a job ID.
        # For simplicity in this demo, we'll wait for the result.
        
        output_path = processor.remove_vocals(file_location)
        
        # Return the processed file
        return FileResponse(output_path, media_type="audio/mpeg", filename=os.path.basename(output_path))
        
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))

# Mount Frontend Static Files (After API routes to avoid conflicts)
# Check if dist exists (it will in Docker)
if os.path.exists("frontend/dist"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Serve index.html for any other route (SPA)
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="Not Found")
        return FileResponse("frontend/dist/index.html")
