from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, Field
import sys
import os

# Menambahkan path agar Python bisa membaca folder proyek secara dinamis
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.models import Base
from ai_grc_agent.scoring_engine import calculate_risk_score

# Mengimpor semua router 
from api.pre_engagement import router as pre_engagement_router
from api.reconnaissance import router as osint_router
from api.scanning import router as scanning_router
from api.exploitation import router as exploit_router
from api.ticketing import router as ticketing_router
from api.dashboard import router as dashboard_router

# Konfigurasi Database Jejak Audit ISO 27001
SQLALCHEMY_DATABASE_URL = "sqlite:///./vapt_iso27001.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

# Dependency Injection untuk Sesi Database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Inisialisasi Aplikasi Utama
app = FastAPI(
    title="VAPT ISO 27001 API", 
    description="Platform terpadu VAPT dan otomatisasi GRC sesuai ISO 27001:2022"
)

# Konfigurasi Keamanan CORS Lanjutan
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Ganti dengan domain production Anda
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Mendaftarkan semua router ke aplikasi utama
app.include_router(pre_engagement_router, prefix="/legal", tags=["Pre-Engagement"])
app.include_router(osint_router, prefix="/recon", tags=["OSINT & Reconnaissance"])
app.include_router(scanning_router, prefix="/scan", tags=["Vulnerability Scanning"])
app.include_router(exploit_router, prefix="/exploit", tags=["Eksploitasi"])
app.include_router(ticketing_router, prefix="/itsm", tags=["Ticketing & Remediasi"])
app.include_router(dashboard_router, prefix="/ui", tags=["UI/UX Dashboards"])

# Endpoint AI Scoring Engine dengan Validasi Ketat
class RiskRequest(BaseModel):
    cvss_score: float = Field(..., ge=0.0, le=10.0)
    epss_score: float = Field(..., ge=0.0, le=1.0)
    is_cisa_kev: bool
    asset_criticality: int = Field(..., ge=1, le=5)

@app.post("/risk/calculate", tags=["AI Scoring Engine"])
def hitung_risiko(request: RiskRequest):
    hasil = calculate_risk_score(
        request.cvss_score, 
        request.epss_score, 
        request.is_cisa_kev, 
        request.asset_criticality
    )
    return {"status": "Berhasil", "data_risiko": hasil}

# Endpoint Dasar
@app.get("/", tags=["Status"])
def read_root():
    return {
        "status": "Aktif", 
        "message": "Arsitektur Microservices VAPT siap digunakan. Database dan semua modul telah terhubung."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)