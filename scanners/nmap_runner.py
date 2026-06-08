import time

def run_nmap_scan(target_ip: str) -> str:
    """
    Simulasi eksekusi Nmap ke sistem target.
    """
    time.sleep(2) # Jeda waktu agar terkesan sedang memindai
    
    # Mengembalikan teks simulasi seolah-olah Nmap berhasil
    return f"""Starting Nmap 7.94 ( https://nmap.org ) 
Nmap scan report for {target_ip}
Host is up (0.012s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
80/tcp   open  http    nginx 1.18.0
443/tcp  open  ssl/http nginx 1.18.0

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 4.51 seconds"""