import os
import io
import base64
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from google import genai
from google.genai import types

load_dotenv()
api_key = (os.getenv("OPENAI_API_KEY") or "").strip()
gemini_key = (os.getenv("GEMINI_API_KEY") or "").strip()
web_origin = (os.getenv("WEB_ORIGIN") or "").strip()

# Provider di default: Gemini. Per tornare a OpenAI imposta IMAGE_PROVIDER=openai
provider = (os.getenv("IMAGE_PROVIDER") or "gemini").strip().lower()
gemini_model = (os.getenv("GEMINI_IMAGE_MODEL") or "gemini-2.5-flash-image").strip()

# 🔎 Log non sensibili per capire cosa vede Render (non stampiamo le chiavi)
print(f"[BOOT] IMAGE_PROVIDER: {provider}")
print(f"[BOOT] Has GEMINI_API_KEY? {'yes' if bool(gemini_key) else 'no'}")
print(f"[BOOT] Has OPENAI_API_KEY? {'yes' if bool(api_key) else 'no'}")
print(f"[BOOT] WEB_ORIGIN: {web_origin or '(empty)'}")

client = OpenAI(api_key=api_key)
gemini_client = genai.Client(api_key=gemini_key) if gemini_key else None

app = FastAPI()

allowed_origins = [os.getenv("WEB_ORIGIN")] if os.getenv("WEB_ORIGIN") else ["http://localhost:5173"]

# CORS: in dev consenti Vite; in prod imposta il dominio del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

class GenerateBody(BaseModel):
    prompt: str
    imageBase64: str   # data URL es. "data:image/jpeg;base64,..."

@app.get("/api/ping")
def ping():
    return {
        "ok": True,
        "provider": provider,
        "has_key": bool(gemini_key) if provider == "gemini" else bool(api_key),
        "web_origin": os.getenv("WEB_ORIGIN") or ""
    }

def data_url_to_bytes(data_url: str) -> bytes:
    try:
        _, b64 = data_url.split(",", 1)
        return base64.b64decode(b64)
    except Exception:
        raise HTTPException(status_code=400, detail="imageBase64 non valido (serve data URL)")

def generate_with_gemini(prompt: str, img_bytes: bytes, data_url: str) -> str:
    if gemini_client is None:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY non configurata")

    mime = data_url.split(";", 1)[0].removeprefix("data:") or "image/jpeg"
    try:
        result = gemini_client.models.generate_content(
            model=gemini_model,
            contents=[prompt, types.Part.from_bytes(data=img_bytes, mime_type=mime)],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    for cand in result.candidates or []:
        for part in (cand.content.parts if cand.content else None) or []:
            if part.inline_data and part.inline_data.data:
                b64 = base64.b64encode(part.inline_data.data).decode()
                return f"data:{part.inline_data.mime_type or 'image/png'};base64,{b64}"
    raise HTTPException(status_code=500, detail="No image returned")

@app.post("/api/generate")
def generate(body: GenerateBody):
    if not body.prompt or not body.imageBase64:
        raise HTTPException(status_code=400, detail="Missing prompt or imageBase64")

    img_bytes = data_url_to_bytes(body.imageBase64)

    if provider != "openai":
        return {"imageUrl": generate_with_gemini(body.prompt, img_bytes, body.imageBase64)}

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
