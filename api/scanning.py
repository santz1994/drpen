from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, IPvAnyAddress, HttpUrl
from typing import Optional, Union
# from main import get_db # Gunakan ini jika ingin menginjeksi aktivitas database

from scanners.nmap_runner import run_nmap_scan

router = APIRouter()

class ScanRequest(BaseModel):
    # Validasi ketat target agar memblokir parameter nmap ilegal (Command Injection)
    target: Union[IPvAnyAddress, HttpUrl] 
    scan_type: str
    credentials: Optional[dict] = None

@router.post("/run-scan/")
def run_vulnerability_scan(request: ScanRequest):
    """
    Menjalankan pemindaian kerentanan mendalam ke infrastruktur.
    """
    if request.scan_type == "credentialed" and not request.credentials:
        raise HTTPException(status_code=400, detail="Kredensial dibutuhkan untuk metode credentialed.")
    
    try:
        if request.scan_type == "non-credentialed":
            # Eksekusi runner Nmap secara aman
            log_hasil = run_nmap_scan(str(request.target))
        else:
            log_hasil = f"Pemindaian credentialed untuk {request.target} dalam tahap penyempurnaan."
            
        return {
            "target": str(request.target),
            "tipe_pemindaian": request.scan_type,
            "status": "Berhasil",
            "log_deteksi": log_hasil
        }
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))