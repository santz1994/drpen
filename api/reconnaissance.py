from fastapi import APIRouter
import socket

router = APIRouter()

@router.get("/osint/{domain}")
async def run_osint(domain: str):
    """
    Fungsi OSINT untuk pengumpulan jejak informasi digital secara pasif.
    """
    try:
        # Contoh sederhana: Mendapatkan IP dari domain (DNS Lookup)
        ip_address = socket.gethostbyname(domain)
        
        # Di sinilah Anda nantinya bisa menambahkan API key pihak ketiga 
        # seperti Shodan, WHOIS, atau Github Dorks untuk footprinting lanjutan.
        
        return {
            "target": domain,
            "ip_address": ip_address,
            "metode": "Passive Reconnaissance",
            "pesan": "Informasi dasar berhasil dikumpulkan tanpa menyentuh server target secara invasif."
        }
    except Exception as e:
        return {"error": f"Gagal mendapatkan informasi: {str(e)}"}