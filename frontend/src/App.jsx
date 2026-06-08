import React, { useState, useEffect } from 'react';

// 1. Komponen Dasbor Teknikal
function TechnicalDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/ui/technical')
      .then(res => res.json()).then(setData)
      .catch(err => console.error("Gagal memuat Dasbor Teknikal:", err));
  }, []);

  if (!data) return <p>Memuat Dasbor Teknikal...</p>;
  return (
    <div>
      <h2>Dasbor Keamanan - {data.role}</h2>
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
        <h3 style={{ color: 'red' }}>Tiket Kerentanan Prioritas:</h3>
        <ul>{data.priority_tickets.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
        <h3>Potongan Kode Rentan:</h3>
        <pre style={{ background: '#282c34', color: '#fff', padding: '10px', borderRadius: '5px' }}>{data.vulnerable_code_snippet}</pre>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '15px', background: '#e6ffed' }}>
        <h3>Rekomendasi Remediasi:</h3>
        <p>{data.actionable_remediation}</p>
      </div>
    </div>
  );
}

// 2. Komponen Dasbor GRC
function GrcDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/ui/grc')
      .then(res => res.json()).then(setData)
      .catch(err => console.error("Gagal memuat Dasbor GRC:", err));
  }, []);

  if (!data) return <p>Memuat Dasbor GRC...</p>;
  return (
    <div>
      <h2>Dasbor Kepatuhan - {data.role}</h2>
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', background: '#f4f6f8' }}>
        <h3>Metrik Kesiapan ISO 27001</h3>
        <p><strong>Skor Kesiapan:</strong> {data.readiness_score}</p>
        <p><strong>Status Kepatuhan:</strong> {data.compliance_status}</p>
        <p><strong>Jumlah Kontrol Diuji:</strong> {data.tested_controls}</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '15px', background: '#e6f7ff' }}>
        <h3>Dokumen Audit (SoA)</h3>
        <p><a href="#">{data.soa_document}</a></p>
      </div>
    </div>
  );
}

// 3. Komponen Simulasi Pentest
function PentestSimulator() {
  const [targetUrl, setTargetUrl] = useState('');
  const [vulnType, setVulnType] = useState('sql_injection');
  const [bypassRoe, setBypassRoe] = useState(false); // State untuk tombol bypass
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePentest = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/exploit/execute/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          target_url: targetUrl, 
          vulnerability_type: vulnType,
          bypass_roe: bypassRoe // Mengirim status bypass ke backend
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Terjadi kesalahan pada server.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px', borderRadius: '5px' }}>
      <h2>Simulasi Penetration Testing (PTES)</h2>
      <p>Pilih target dan jenis serangan untuk memvalidasi kerentanan.</p>
      
      <form onSubmit={handlePentest} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Masukkan Target URL (misal: 192.168.1.10)" 
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        
        <select value={vulnType} onChange={(e) => setVulnType(e.target.value)} style={{ padding: '8px' }}>
          <option value="sql_injection">SQL Injection</option>
          <option value="xss">Cross-Site Scripting (XSS)</option>
        </select>

        {/* Checkbox GUI untuk Bypass Otorisasi */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#fff3cd', padding: '10px', border: '1px solid #ffeeba', borderRadius: '5px' }}>
          <input 
            type="checkbox" 
            checked={bypassRoe} 
            onChange={(e) => setBypassRoe(e.target.checked)} 
          />
          <strong>Bypass Otorisasi Hukum (Simulasi)</strong>
        </label>

        <button type="submit" style={{ padding: '10px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px' }}>
          Jalankan Eksploitasi
        </button>
      </form>

      {error && <div style={{ marginTop: '15px', padding: '10px', background: '#ffe6e6', color: '#d9534f', border: '1px solid #d9534f', borderRadius: '5px' }}><strong>Akses Ditolak: </strong> {error}</div>}
      
      {result && (
        <div style={{ marginTop: '15px', padding: '15px', background: '#e6ffed', border: '1px solid #28a745', borderRadius: '5px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>Eksploitasi Selesai</h3>
          <p><strong>Target:</strong> {result.target}</p>
          <p><strong>Tipe Serangan:</strong> {result.tipe_serangan}</p>
          <p><strong>Log Sistem:</strong> {result.log_eksploitasi}</p>
        </div>
      )}
    </div>
  );
}

// 4. Aplikasi Utama dengan Navigasi Tab (Satu-satunya export default)
export default function App() {
  const [activeTab, setActiveTab] = useState('technical');

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('technical')} 
          style={{ marginRight: '10px', padding: '10px', fontWeight: activeTab === 'technical' ? 'bold' : 'normal', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' }}>
          Dasbor Teknikal
        </button>
        <button 
          onClick={() => setActiveTab('grc')} 
          style={{ marginRight: '10px', padding: '10px', fontWeight: activeTab === 'grc' ? 'bold' : 'normal', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' }}>
          Dasbor GRC
        </button>
        <button 
          onClick={() => setActiveTab('pentest')} 
          style={{ padding: '10px', fontWeight: activeTab === 'pentest' ? 'bold' : 'normal', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' }}>
          Simulasi Pentest
        </button>
      </div>
      
      {activeTab === 'technical' && <TechnicalDashboard />}
      {activeTab === 'grc' && <GrcDashboard />}
      {activeTab === 'pentest' && <PentestSimulator />}
    </div>
  );
}