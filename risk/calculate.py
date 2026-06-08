function RiskCalculator() {
  const [cvss, setCvss] = useState(5.0);
  const [epss, setEpss] = useState(0.5);
  const [criticality, setCriticality] = useState(3);
  const [isCisa, setIsCisa] = useState(false);
  const [riskData, setRiskData] = useState(null);

  const calculateRisk = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/risk/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvss_score: parseFloat(cvss), epss_score: parseFloat(epss), is_cisa_kev: isCisa, asset_criticality: parseInt(criticality) })
      });
      const data = await response.json();
      setRiskData(data.data_risiko);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h2>Kalkulator Risiko VAPT (AI Scoring)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label>CVSS Score (0-10): {cvss}</label>
          <input type="range" min="0" max="10" step="0.1" value={cvss} onChange={(e) => setCvss(e.target.value)} onMouseUp={calculateRisk} style={{ width: '100%' }} />
          
          <label style={{ display: 'block', marginTop: '10px' }}>EPSS Probability (0-1): {epss}</label>
          <input type="range" min="0" max="1" step="0.01" value={epss} onChange={(e) => setEpss(e.target.value)} onMouseUp={calculateRisk} style={{ width: '100%' }} />
          
          <label style={{ display: 'block', marginTop: '10px' }}>Kekritisan Aset (1-5): {criticality}</label>
          <input type="range" min="1" max="5" step="1" value={criticality} onChange={(e) => setCriticality(e.target.value)} onMouseUp={calculateRisk} style={{ width: '100%' }} />
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
            <input type="checkbox" checked={isCisa} onChange={(e) => { setIsCisa(e.target.checked); calculateRisk(); }} /> Masuk Daftar CISA KEV?
          </label>
        </div>
        
        {riskData && (
          <div style={{ padding: '20px', background: '#343a40', color: 'white', borderRadius: '5px', textAlign: 'center' }}>
            <h3>Final Risk Score</h3>
            <h1 style={{ fontSize: '3rem', margin: '10px 0', color: riskData.score > 8 ? '#dc3545' : riskData.score > 4 ? '#ffc107' : '#28a745' }}>
              {riskData.score ?? "N/A"}
            </h1>
            <p><strong>Kategori:</strong> {riskData.category ?? "Unknown"}</p>
          </div>
        )}
      </div>
    </div>
  );
}