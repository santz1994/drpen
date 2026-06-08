# ai_grc_agent/scoring_engine.py

def calculate_risk_score(cvss_score: float, epss_score: float, is_cisa_kev: bool, asset_criticality: int):
    """
    Scoring Engine untuk mengkalkulasi risiko kerentanan.
    Menggunakan Youden's Index pada model ML aslinya untuk meminimalkan False Positives.
    """
    # Simulasi perhitungan bobot risiko
    # CVSS (0-10), EPSS (0.0-1.0), Criticality (1-5)
    risk_score = (cvss_score * 4) + (epss_score * 100 * 0.3) + (asset_criticality * 5)
    
    # Jika kerentanan dieksploitasi aktif (CISA KEV), risiko melonjak drastis
    if is_cisa_kev:
        risk_score += 25 
        
    final_score = min(risk_score, 100) # Membatasi skor maksimal di 100
    
    if final_score >= 80:
        severity = "Kritis (Segera Patch!)"
    elif final_score >= 60:
        severity = "Tinggi"
    else:
        severity = "Sedang / Rendah"
        
    return {
        "skor_akhir": round(final_score, 2),
        "tingkat_keparahan": severity
    }

# Contoh pengujian
if __name__ == "__main__":
    hasil = calculate_risk_score(cvss_score=8.5, epss_score=0.9, is_cisa_kev=True, asset_criticality=4)
    print(hasil)