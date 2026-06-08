import React, { useState } from 'react';

// ==========================================
// 1. KOMPONEN MANAJEMEN LEGAL & ROE
// ==========================================
function LegalDashboard({ isAuthorized, setIsAuthorized }) {
  const handleUpload = (e) => {
    e.preventDefault();
    // Simulasi proses upload dan validasi dokumen oleh backend
    setTimeout(() => {
      setIsAuthorized(true);
      alert("Dokumen Rules of Engagement (RoE) berhasil divalidasi. Otorisasi Diberikan.");
    }, 1000);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', background: '#f8f9fa' }}>
      <h2>Manajemen Pre-Engagement (Hukum & RoE)</h2>
      <p>Sesuai UU ITE, seluruh aktivitas VAPT memerlukan otorisasi eksplisit.</p>
      
      <div style={{ padding: '15px', background: isAuthorized ? '#d4edda' : '#f8d7da', color: isAuthorized ? '#155724' : '#721c24', marginBottom: '15px', borderRadius: '5px' }}>
        <strong>Status Otorisasi: </strong> {isAuthorized ? "✅ APPROVED (Siap untuk Pentest)" : "❌ PENDING (Akses Eksploitasi Terkunci)"}
      </div>

      {!isAuthorized && (
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px' }}>
          <input type="file" required style={{ padding: '5px' }} />
          <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Unggah Dokumen Legal
          </button>
        </form>
      )}
    </div>
  );
}

// ==========================================
// 2. KOMPONEN KONSOL PEMINDAIAN (SCANNER)
// ==========================================
function ScannerDashboard() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('non-credentialed');
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true); setLog('Memulai pemindaian ke target...');
    try {
      const response = await fetch('http://127.0.0.1:8000/scan/run-scan/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target, scan_type: scanType })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);
      setLog(data.log_deteksi);
    } catch (err) {
      setLog("Gagal mengeksekusi pemindaian: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h2>Konsol Pemindaian Kerentanan (DAST / Recon)</h2>
      <form onSubmit={handleScan} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="IP / URL Target" value={target} onChange={(e) => setTarget(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
        <select value={scanType} onChange={(e) => setScanType(e.target.value)} style={{ padding: '8px' }}>
          <option value="non-credentialed">Non-Credentialed Scan</option>
          <option value="credentialed">Credentialed Scan</option>
        </select>
        <button type="submit" disabled={loading} style={{ padding: '8px 15px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Memindai...' : 'Mulai Scan'}
        </button>
      </form>

      <div style={{ background: '#1e1e1e', color: '#00ff00', padding: '15px', borderRadius: '5px', minHeight: '200px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        {log || '> Menunggu perintah...'}
      </div>
    </div>
  );
}

// ==========================================
// 3. KOMPONEN SIMULATOR EKSPLOITASI
// ==========================================
function PentestSimulator({ isAuthorized }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [vulnType, setVulnType] = useState('sql_injection');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePentest = async (e) => {
    e.preventDefault();
    setResult(null); setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/exploit/execute/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          target_url: targetUrl, 
          vulnerability_type: vulnType,
          bypass_roe: isAuthorized // Dikontrol oleh tab Pre-Engagement
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h2>Simulasi Penetration Testing (PTES)</h2>
      <form onSubmit={handlePentest} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        <input type="text" placeholder="Masukkan Target" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} required style={{ padding: '8px' }} />
        <select value={vulnType} onChange={(e) => setVulnType(e.target.value)} style={{ padding: '8px' }}>
          <option value="sql_injection">SQL Injection</option>
          <option value="xss">Cross-Site Scripting (XSS)</option>
        </select>
        
        <button type="submit" disabled={!isAuthorized} style={{ padding: '10px', background: isAuthorized ? '#dc3545' : '#ccc', color: '#fff', border: 'none', cursor: isAuthorized ? 'pointer' : 'not-allowed', fontWeight: 'bold', borderRadius: '5px' }}>
          {isAuthorized ? "Jalankan Eksploitasi" : "Terkunci: Menunggu RoE"}
        </button>
      </form>

      {error && <div style={{ marginTop: '15px', color: 'red' }}><strong>Error: </strong> {error}</div>}
      {result && (
        <div style={{ marginTop: '15px', padding: '15px', background: '#e6ffed', border: '1px solid #28a745', borderRadius: '5px' }}>
          <h3 style={{ color: '#28a745' }}>Eksploitasi Selesai</h3>
          <p><strong>Log:</strong> {result.log_eksploitasi}</p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. KOMPONEN KALKULATOR RISIKO (AI SCORING)
// ==========================================
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

// ==========================================
// 5A. KOMPONEN DASBOR TEKNIKAL (ITSM REMEDIASI)
// ==========================================
function TechnicalDashboard() {
  // Simulasi data tiket yang ditarik dari backend (/itsm/tickets)
  const [tickets, setTickets] = useState([
    { id: "TKT-101", title: "SQL Injection di Endpoint /login", severity: "Kritis", status: "Open", sla: "1 Hari", control: "A.8.28 Secure Coding" },
    { id: "TKT-102", title: "Cross-Site Scripting (XSS) di Form Pencarian", severity: "Tinggi", status: "In Progress", sla: "3 Hari", control: "A.8.28 Secure Coding" },
    { id: "TKT-098", title: "Port 22 (SSH) Terekspos ke Publik", severity: "Menengah", status: "Closed", sla: "Selesai", control: "A.8.22 Segregation of Networks" }
  ]);

  const handleUploadEvidence = (ticketId) => {
    alert(`Membuka form unggah bukti perbaikan (Peer Code Review / Patch Log) untuk tiket ${ticketId}...`);
    // Logika integrasi ke backend update tiket akan diletakkan di sini
  };

  const getSeverityColor = (severity) => {
    if (severity === 'Kritis') return '#dc3545'; // Merah
    if (severity === 'Tinggi') return '#fd7e14'; // Oranye
    if (severity === 'Menengah') return '#ffc107'; // Kuning
    return '#28a745'; // Hijau
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', background: '#fff' }}>
      <h2>Dasbor Teknikal & ITSM (Developer View)</h2>
      <p style={{ color: '#666' }}>Fokus Remediasi: Terapkan <strong>Parameterized Queries</strong> untuk SQLi dan <strong>Context-Aware HTML Escaping</strong> untuk XSS.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {tickets.map(ticket => (
          <div key={ticket.id} style={{ borderLeft: `5px solid ${getSeverityColor(ticket.severity)}`, padding: '15px', background: '#f8f9fa', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{ticket.id} - {ticket.title}</h4>
              <div style={{ fontSize: '0.9em', color: '#555', display: 'flex', gap: '15px' }}>
                <span><strong>Status:</strong> {ticket.status}</span>
                <span><strong>Keparahan:</strong> {ticket.severity}</span>
                <span><strong>SLA Remediasi:</strong> <span style={{ color: ticket.status !== 'Closed' ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>{ticket.sla}</span></span>
                <span><strong>Kontrol ISO:</strong> {ticket.control}</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleUploadEvidence(ticket.id)}
              disabled={ticket.status === 'Closed'}
              style={{ padding: '8px 15px', background: ticket.status === 'Closed' ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: ticket.status === 'Closed' ? 'not-allowed' : 'pointer' }}
            >
              {ticket.status === 'Closed' ? 'Telah Ditambal' : 'Unggah Bukti (Evidence)'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5B. KOMPONEN DASBOR GRC (CISO & AUDITOR VIEW)
// ==========================================
function GrcDashboard() {
  // Simulasi kalkulasi kesiapan ISO 27001
  const readinessScore = 88; // Turun dari 100% karena ada SQLi & XSS yang Open

  const annexControls = [
    { id: "A.8.8", name: "Management of Technical Vulnerabilities", status: "Alert", issue: "Ditemukan 2 kerentanan belum ditambal." },
    { id: "A.8.28", name: "Secure Coding", status: "Non-Compliant", issue: "Kode rentan injeksi (SQLi/XSS) terdeteksi." },
    { id: "A.8.29", name: "Security Testing in Development", status: "Compliant", issue: "Integrasi VAPT otomatis berjalan baik." },
    { id: "A.5.1", name: "Policies for Information Security", status: "Compliant", issue: "Dokumen RoE dan kebijakan valid." }
  ];

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', background: '#fff' }}>
      <h2>Dasbor GRC ISO 27001:2022</h2>
      
      {/* Widget Kesiapan Global */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div style={{ flex: 1, padding: '20px', background: '#343a40', color: '#fff', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#aaa' }}>Readiness Score (SoA)</h3>
          <h1 style={{ fontSize: '4rem', margin: '10px 0', color: readinessScore >= 90 ? '#28a745' : '#ffc107' }}>
            {readinessScore}%
          </h1>
          <p style={{ margin: 0 }}>Target Kepatuhan Audit: {">"} 95%</p>
        </div>
        
        <div style={{ flex: 1, padding: '20px', border: '1px solid #eee', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ marginTop: 0 }}>Status Postur Keamanan</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
            <li>🔴 <strong>2</strong> Kerentanan Kritis/Tinggi (Open)</li>
            <li>🟡 <strong>1</strong> Dokumen Hukum (Pending Review)</li>
            <li>🟢 <strong>14</strong> Kontrol Annex A (Compliant)</li>
          </ul>
        </div>
      </div>

      {/* Tabel Statement of Applicability (SoA) Live */}
      <h3>Live Statement of Applicability (SoA) Tracker</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>Kontrol Annex A</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>Status Kepatuhan</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>Catatan Auditor / Sistem</th>
          </tr>
        </thead>
        <tbody>
          {annexControls.map((ctrl, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}><strong>{ctrl.id}</strong> - {ctrl.name}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  padding: '5px 10px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold',
                  background: ctrl.status === 'Compliant' ? '#d4edda' : ctrl.status === 'Alert' ? '#fff3cd' : '#f8d7da',
                  color: ctrl.status === 'Compliant' ? '#155724' : ctrl.status === 'Alert' ? '#856404' : '#721c24'
                }}>
                  {ctrl.status}
                </span>
              </td>
              <td style={{ padding: '10px', color: '#555' }}>{ctrl.issue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// 6. APLIKASI UTAMA (MAIN APP)
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('legal');
  const [isAuthorized, setIsAuthorized] = useState(false); // State global untuk mengunci eksploitasi

  // Gaya untuk tombol navigasi
  const btnStyle = (tabName) => ({
    padding: '10px 15px', marginRight: '10px', cursor: 'pointer',
    borderRadius: '5px 5px 0 0', border: '1px solid #ccc', borderBottom: 'none',
    background: activeTab === tabName ? '#fff' : '#f1f1f1',
    fontWeight: activeTab === tabName ? 'bold' : 'normal'
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Banner Peringatan Insiden PDP */}
      <div style={{ background: '#dc3545', color: '#fff', padding: '10px', textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', borderRadius: '5px' }}>
        🚨 SISTEM SIAGA: Kepatuhan Pelaporan Insiden UU PDP Aktif (Respons Maks. 3x24 Jam)
      </div>

      <div style={{ borderBottom: '2px solid #ccc', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        <button onClick={() => setActiveTab('legal')} style={btnStyle('legal')}>Pre-Engagement</button>
        <button onClick={() => setActiveTab('scan')} style={btnStyle('scan')}>Pemindaian (Scan)</button>
        <button onClick={() => setActiveTab('pentest')} style={btnStyle('pentest')}>Simulator Eksploitasi</button>
        <button onClick={() => setActiveTab('risk')} style={btnStyle('risk')}>Kalkulator Risiko</button>
        <button onClick={() => setActiveTab('technical')} style={btnStyle('technical')}>Dasbor Teknikal</button>
        <button onClick={() => setActiveTab('grc')} style={btnStyle('grc')}>Dasbor GRC</button>
      </div>
      
      {activeTab === 'legal' && <LegalDashboard isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} />}
      {activeTab === 'scan' && <ScannerDashboard />}
      {activeTab === 'pentest' && <PentestSimulator isAuthorized={isAuthorized} />}
      {activeTab === 'risk' && <RiskCalculator />}
      {activeTab === 'technical' && <TechnicalDashboard />}
      {activeTab === 'grc' && <GrcDashboard />}
      
    </div>
  );
}