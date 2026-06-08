from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# Skema data temuan kerentanan
class VulnerabilityData(BaseModel):
    vulnerability_name: str
    severity: str
    code_line: str
    remediation_instruction: str

@router.post("/create-ticket/")
async def create_itsm_ticket(data: VulnerabilityData):
    """
    Otomatisasi pembuatan tiket ke Jira/ServiceNow berdasarkan hasil pemindaian.
    Sistem juga dapat disiapkan untuk melakukan re-test saat tiket ditutup.
    """
    # Di sini nantinya Anda memasukkan kredensial dan URL API Jira/ServiceNow Anda
    simulasi_ticket_id = "VAPT-101"
    
    log_integrasi = (
        f"Tiket {simulasi_ticket_id} berhasil dibuat. "
        f"Kerentanan: {data.vulnerability_name} ({data.severity}). "
        f"Lokasi: Baris kode {data.code_line}."
    )
    
    return {
        "status_integrasi": "Berhasil",
        "platform": "Jira / ServiceNow",
        "ticket_id": simulasi_ticket_id,
        "detail_tugas": log_integrasi
    }