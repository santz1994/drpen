from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, func
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class AssetInventory(Base):
    __tablename__ = 'Asset_Inventory'
    id = Column(Integer, primary_key=True, index=True)
    asset_reference = Column(String, unique=True, index=True)
    owner = Column(String)
    classification = Column(String)
    environment = Column(String)
    
    # Membangun relasi dua arah ke registri kerentanan
    vulnerabilities = relationship("VulnerabilityRegister", back_populates="asset")

class VulnerabilityRegister(Base):
    __tablename__ = 'Vulnerability_Register'
    unique_id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey('Asset_Inventory.id')) 
    date_discovered = Column(Date)
    cve_cwe_code = Column(String)
    severity_score = Column(String) 
    treatment_decision = Column(String) 
    remediation_sla = Column(String)
    
    # Kolom Audit Internal ISO 27001
    status = Column(String, default="Open")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    asset = relationship("AssetInventory", back_populates="vulnerabilities")
    evidence = relationship("ComplianceEvidence", back_populates="vulnerability")

class ComplianceEvidence(Base):
    __tablename__ = 'Compliance_Evidence'
    id = Column(Integer, primary_key=True, index=True)
    vulnerability_id = Column(Integer, ForeignKey('Vulnerability_Register.unique_id'))
    evidence_of_closure = Column(String) 
    pentest_report_pdf = Column(String) 
    peer_code_review = Column(String)
    
    vulnerability = relationship("VulnerabilityRegister", back_populates="evidence")