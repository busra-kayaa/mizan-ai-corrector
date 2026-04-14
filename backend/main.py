import os
import sys
import time
import uvicorn
import logging
import asyncio
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.requests import Request

load_dotenv()

# --- LOGGING AYARI ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- 1. YOL AYARLARI ---
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..'))

if project_root not in sys.path:
    sys.path.append(project_root)

# --- 2. HİBRİT MOTORU İMPORT ---
try:
    from pipeline import MizanHybridPipeline
    logger.info("✅ Mizan Hibrit Pipeline entegre edildi.")
except ImportError as e:
    raise RuntimeError(f"Import hatası: {e}")

# --- 3. AYARLAR ---
API_PORT = int(os.getenv("API_PORT", 8000))
API_HOST = os.getenv("API_HOST", "127.0.0.1")

# Hız sınırlayıcı (Rate Limiter)
limiter = Limiter(key_func=get_remote_address)

# --- 4. MODEL YÖNETİMİ (LIFESPAN) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Mizan API başlatılıyor...")

    model_path = os.path.join(current_dir, "models", "Meta-Llama-3.1-8B.Q4_K_M.gguf")
    logger.info(f"🔍 Model aranıyor: {model_path}")

    if not os.path.exists(model_path):
        raise RuntimeError(f"Model bulunamadı: {model_path}")

    try:
        app.state.mizan = MizanHybridPipeline(gguf_path=model_path)
        logger.info(f"✅ Model hazır: {API_HOST}:{API_PORT}")
    except Exception as e:
        raise RuntimeError(f"Model yüklenemedi: {str(e)}")

    yield
    logger.info("🛑 API kapatılıyor...")

# --- 5. FASTAPI YAPILANDIRMASI ---
app = FastAPI(
    title="Mizan API",
    description="Tamamen Yerel Hibrit Normalizasyon Motoru",
    version="1.0.0",
    lifespan=lifespan
)

app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Çok fazla istek gönderildi. Lütfen bir süre bekleyin."}
    )

# --- 6. CORS GÜVENLİĞİ ---
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# --- 7. ŞEMALAR ---
class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)

class BatchRequest(BaseModel):
    texts: List[str] = Field(..., min_length=1)

class CorrectionDetail(BaseModel):
    original: str
    corrected: str
    type: str
    explanation: Optional[str] = "Düzeltildi."

class AnalyzeResponse(BaseModel):
    originalText: str
    correctedText: str
    corrections: List[CorrectionDetail]
    metadata: Optional[dict] = None

class BatchResultItem(BaseModel):
    status: str
    correctedText: str
    corrections: Optional[List[CorrectionDetail]] = []

class BatchResponse(BaseModel):
    results: List[BatchResultItem]
    metadata: Optional[dict] = None

# --- 8. MIDDLEWARE (LOGGING) ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(f"{request.method} {request.url} - {duration}ms")
    return response

# --- 9. ENDPOINTS ---
@app.get("/health", tags=["System"])
async def health_check(request: Request):
    model_loaded = hasattr(request.app.state, "mizan")
    return {
        "status": "online",
        "version": "1.0.0",
        "model_loaded": model_loaded
    }

# ANA ANALİZ ROTASI
@app.post("/analyze", response_model=AnalyzeResponse, tags=["Analysis"])
@limiter.limit("20/minute")
async def analyze_text(request: Request, payload: AnalyzeRequest):
    if await request.is_disconnected():
        logger.info("Kullanıcı bağlantıyı kopardı, işlem iptal edildi.")
        return JSONResponse(status_code=499, content={"detail": "Client Closed Request"})

    if not hasattr(request.app.state, "mizan"):
        raise HTTPException(status_code=503, detail="Model henüz yüklenmedi, lütfen bekleyin.")

    model = request.app.state.mizan
    start_time = time.time()

    try:
        sonuc = await asyncio.to_thread(model.process, payload.text)
        process_time_ms = round((time.time() - start_time) * 1000, 2)

        meta = sonuc.get("metadata", {})
        meta.update({
            "processing_time_ms": process_time_ms,
            "char_count": len(payload.text),
            "mode": "normal"
        })

        return AnalyzeResponse(
            originalText=sonuc.get("originalText", payload.text),
            correctedText=sonuc.get("correctedText", payload.text),
            corrections=sonuc.get("corrections", []),
            metadata=meta
        )

    except Exception as e:
        logger.error(f"❌ Model İşleme Hatası: {str(e)}")
        raise HTTPException(status_code=500, detail="Metin işlenirken bir hata oluştu.")


# TOPLU ANALİZ ROTASI (BATCH)
@app.post("/batch", response_model=BatchResponse, tags=["Analysis"])
@limiter.limit("5/minute")
async def batch_analyze(request: Request, payload: BatchRequest):
    if not hasattr(request.app.state, "mizan"):
        raise HTTPException(status_code=503, detail="Model henüz yüklenmedi, lütfen bekleyin.")

    model = request.app.state.mizan
    start_time = time.time()
    
    results = []
    total_regex = 0
    total_neural = 0

    for text in payload.texts:
        if await request.is_disconnected():
            logger.warning("Kullanıcı toplu analizi iptal etti. İşlem durduruluyor...")
            break

        try:
            sonuc = await asyncio.to_thread(model.process, text)
            results.append(BatchResultItem(
                status="success", 
                correctedText=sonuc.get("correctedText", text),
                corrections=sonuc.get("corrections", [])
            ))
            total_regex += sonuc.get("metadata", {}).get("regex_count", 0)
            total_neural += sonuc.get("metadata", {}).get("neural_count", 0)
        except Exception as e:
            logger.error(f"❌ Batch Hatası ({text[:15]}...): {str(e)}")
            results.append(BatchResultItem(status="error", correctedText=text, corrections=[]))

    process_time_ms = round((time.time() - start_time) * 1000, 2)

    meta = {
        "mode": "normal",
        "total_processed": len(results),
        "processing_time_ms": process_time_ms,
        "regex_count": total_regex,
        "neural_count": total_neural
    }

    return BatchResponse(results=results, metadata=meta)


# --- 10. ÇALIŞTIRMA ---
if __name__ == "__main__":
    uvicorn.run("main:app", host=API_HOST, port=API_PORT, reload=True)