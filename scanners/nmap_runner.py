import subprocess

def run_nmap_scan(target_ip):
    """
    Mengeksekusi Nmap secara terprogram untuk pemindaian non-credentialed.
    """
    print(f"Memulai pemindaian pada {target_ip}...")
    try:
        # Menjalankan perintah nmap dasar di terminal melalui Python
        hasil = subprocess.run(['nmap', '-sV', target_ip], capture_output=True, text=True)
        return hasil.stdout
    except FileNotFoundError:
        return "Nmap belum terinstal di sistem Anda."
    except Exception as e:
        return f"Terjadi kesalahan: {e}"

# Contoh eksekusi saat file dijalankan
if __name__ == "__main__":
    target = "127.0.0.1" # Target localhost
    log_hasil = run_nmap_scan(target)
    print("Hasil Pemindaian:\n", log_hasil)