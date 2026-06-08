from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class AssetInventory(Base):
    __tablename__ = 'Asset_Inventory'
    id = Column(Integer, primary_key=True)
    asset_reference = Column(String)
    owner = Column(String)
    classification = Column(String)
    environment = Column(String)
    vulnerabilities = relationship("VulnerabilityRegister", back_populates="asset")

# Tabel 2: Register Kerentanan
class VulnerabilityRegister(Base):
    __tablename__ = 'Vulnerability_Register'
    unique_id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey('Asset_Inventory.id'))
    date_discovered = Column(Date)
    cve_cwe_code = Column(String)
    severity_score = Column(String) # Skor CVSS/EPSS
    treatment_decision = Column(String) # Mitigate, Accept, atau Transfer
    asset = relationship("AssetInventory", back_populates="vulnerabilities")
    evidence = relationship("ComplianceEvidence", back_populates="vulnerability")

# Tabel 3: Bukti Kepatuhan
class ComplianceEvidence(Base):
    __tablename__ = 'Compliance_Evidence'
    id = Column(Integer, primary_key=True)
    evidence_of_closure = Column(String) # Tautan log penutupan celah
    pentest_report_pdf = Column(String)
    peer_code_review = Column(String)
    