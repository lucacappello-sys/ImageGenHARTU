import os
import io
import base64
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY non impostata (env)")

client = OpenAI(api_key=api_key)

app = FastAPI()

# CORS: in dev consenti Vite; in prod imposta il dominio del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEB_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

class GenerateBody(BaseModel):
    prompt: str
    imageBase64: str   # data URL es. "data:image/jpeg;base64,..."

@app.get("/api/ping")
def ping():
    return {"ok": True}

def data_url_to_bytes(data_url: str) -> bytes:
    try:
        _, b64 = data_url.split(",", 1)
        return base64.b64decode(b64)
    except Exception:
        raise HTTPException(status_code=400, detail="imageBase64 non valido (serve data URL)")

@app.post("/api/generate")
def generate(body: GenerateBody):
    if not body.prompt or not body.imageBase64:
        raise HTTPException(status_code=400, detail="Missing prompt or imageBase64")

    img_bytes = data_url_to_bytes(body.imageBase64)
    f = io.BytesIO(img_bytes)
    f.name = "input.jpg"  # un nome aiuta alcune librerie

    try:
        result = client.images.edit(
            model="gpt-image-1",
            prompt=body.prompt,
            image=f,
            size="1024x1024",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not result or not result.data or not result.data[0].b64_json:
        raise HTTPException(status_code=500, detail="No image returned")

    b64 = result.data[0].b64_json
    return {"imageUrl": f"data:image/png;base64,{b64}"}
