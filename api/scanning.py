from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Skema data untuk menerima permintaan (request) pemindaian
class ScanRequest(BaseModel):
    target: str
    scan_type: str  # Pilihan: 'credentialed' atau 'non-credentialed'
    credentials: Optional[dict] = None  # Hanya diisi jika scan_type = credentialed

@router.post("/run-scan/")
async def run_vulnerability_scan(request: ScanRequest):
    """
    Menjalankan pemindaian kerentanan. Mendukung metode credentialed 
    dan non-credentialed terhadap jaringan, host, dan database.
    """
    # Validasi jika pengguna memilih credentialed scan tapi tidak memasukkan kredensial
    if request.scan_type == "credentialed" and not request.credentials:
        raise HTTPException(status_code=400, detail="Kredensial (username/password/key) dibutuhkan untuk metode credentialed.")
    
    # Di sinilah Anda menghubungkan skrip dengan file `scanners/nmap_runner.py` 
    # atau `zap_runner.py` yang sudah kita buat sebelumnya.
    if request.scan_type == "credentialed":
        log_hasil = f"Memindai {request.target} dengan autentikasi... (Simulasi: Ditemukan miskonfigurasi database)"
    else:
        log_hasil = f"Memindai {request.target} tanpa autentikasi... (Simulasi: Ditemukan port 80 dan 443 terbuka)"
        
    return {
        "target": request.target,
        "tipe_pemindaian": request.scan_type,
        "status": "Berhasil",
        "log_deteksi": log_hasil
    }