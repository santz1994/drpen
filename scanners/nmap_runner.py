# Di dalam api/scanning.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

# Impor runner nmap yang sudah dibuat
from scanners.nmap_runner import run_nmap_scan 

router = APIRouter()

class ScanRequest(BaseModel):
    target: str
    scan_type: str
    credentials: Optional[dict] = None

@router.post("/run-scan/")
async def run_vulnerability_scan(request: ScanRequest):
    if request.scan_type == "credentialed" and not request.credentials:
        raise HTTPException(status_code=400, detail="Kredensial dibutuhkan.")
    
    # Eksekusi pemindaian secara nyata
    log_hasil = ""
    if request.scan_type == "non-credentialed":
        log_hasil = run_nmap_scan(request.target)
    else:
        log_hasil = f"Pemindaian credentialed untuk {request.target} belum diimplementasikan di runner."
        
    return {
        "target": request.target,
        "tipe_pemindaian": request.scan_type,
        "status": "Berhasil",
        "log_deteksi": log_hasil
    }