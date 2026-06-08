from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/grc")
async def view_grc_dashboard():
    """
    Dasbor GRC untuk CISO/Auditor. Menampilkan metrik kesiapan ISO 27001,
    jumlah kontrol yang diuji, dan akses ke Statement of Applicability (SoA) [1, 3].
    """
    return {
        "role": "CISO / Auditor",
        "readiness_score": "92% Kesiapan Annex A",
        "tested_controls": 85,
        "compliance_status": "Baik",
        "soa_document": "soa_terbaru_otomatis.pdf"
    }

@router.get("/technical")
async def view_technical_dashboard():
    """
    Dasbor untuk Developer/Pentester. Menampilkan antrean tiket prioritas,
    potongan kode rentan, dan instruksi secure coding [1, 2].
    """
    return {
        "role": "Developer / Pentester",
        "priority_tickets": ["VAPT-101 (SQLi Kritis)", "VAPT-102 (XSS Sedang)"],
        "actionable_remediation": "Gunakan parameterized queries (misal: PreparedStatement di Java atau library sqlite3 di Python).",
        "vulnerable_code_snippet": "SELECT * FROM users WHERE username = '"
    }

@router.post("/incident-alert")
async def trigger_incident_alert():
    """
    Modul Manajemen Insiden. Memunculkan peringatan proaktif jika ada serangan.
    Sesuai Pasal 46 UU PDP, batas waktu pelaporan adalah maksimal 3x24 jam [2, 3].
    """
    return {
        "status": "PERINGATAN KRITIS",
        "pesan": "Terdeteksi indikasi kebocoran data! Segera jalankan Incident Response Plan.",
        "uu_pdp_compliance": "Sisa waktu pelaporan pelanggaran data ke otoritas: 71 Jam 59 Menit (Batas 3x24 jam)"
    }