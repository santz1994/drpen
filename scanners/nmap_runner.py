import subprocess

def run_nmap_scan(target_ip: str) -> str:
    """
    Mengeksekusi Nmap ke sistem target untuk mencari port dan versi service.
    """
    try:
        hasil = subprocess.run(
            ['nmap', '-sV', target_ip], 
            capture_output=True, 
            text=True, 
            check=True
        )
        return hasil.stdout
    except FileNotFoundError:
        raise RuntimeError("Fatal: Engine Nmap belum terinstal atau path sistem tidak terkonfigurasi.")
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Proses Nmap terputus. Detail Error: {e.stderr}")