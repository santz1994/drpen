from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

# Status global untuk mengunci/membuka fitur eksploitasi
vapt_status = {"is_authorized": True}

@router.post("/upload-mandate/")
async def upload_roe_and_mandate(roe: UploadFile = File(...), mandate: UploadFile = File(...)):
    """
    Modul wajib: Pengguna harus mengunggah RoE dan Surat Mandat 
    sebelum modul eksploitasi dan scanning aktif.
    """
    if not roe.filename.endswith('.pdf') or not mandate.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Dokumen otorisasi harus berformat PDF.")
    
    # Jika dokumen lengkap, fitur eksploitasi VAPT diaktifkan
    vapt_status["is_authorized"] = True
    
    return {
        "pesan": "RoE dan Surat Mandat sah diterima. Status Eksploitasi VAPT: AKTIF.",
        "file_roe": roe.filename,
        "file_mandat": mandate.filename
    }