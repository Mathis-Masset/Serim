"""
Routes FastAPI pour gérer les campagnes D&D.
Support du téléchargement d'images via FastAPI UploadFile.
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from fastapi.responses import FileResponse
from sqlmodel import Session, select, create_engine
from typing import List, Optional
from pathlib import Path
import shutil
import uuid
import os

from db import Campaigns, Users, Sheets

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

# Dossier pour stocker les images
IMAGES_DIR = Path("./images")
IMAGES_DIR.mkdir(exist_ok=True)

# Configuration de la session (dépendance)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///database.db")
engine = create_engine(DATABASE_URL, echo=False)

def get_session():
    """Dépendance pour obtenir une session de base de données."""
    with Session(engine) as session:
        yield session


# ============================================================================
# CRÉER UNE CAMPAGNE AVEC IMAGE
# ============================================================================

@router.post("/create")
def create_campaign(
    name: str = Form(...),
    code: str = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(None),
    creator_id: int = Form(...),
    session: Session = Depends(get_session),
) -> dict:
    """
    Crée une nouvelle campagne.
    - name: Nom de la campagne
    - code: Code unique de la campagne
    - description: Description optionnelle
    - image: Fichier image optionnel (jpg, png)
    - creator_id: ID du user qui crée la campagne
    """
    
    # Vérifier que l'utilisateur existe
    user = session.get(Users, creator_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Vérifier que le code n'existe pas déjà
    existing = session.exec(select(Campaigns).where(Campaigns.code == code)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Campaign code already exists")
    
    # Gérer l'image si fournie
    image_path = None
    if image:
        # Générer un nom unique pour l'image
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        image_path = f"images/{unique_filename}"
        
        # Sauvegarder l'image sur le disque
        file_location = IMAGES_DIR / unique_filename
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    
    # Créer la campagne
    campaign = Campaigns(
        name=name,
        code=code,
        description=description,
        image_path=image_path,
        creator_id=creator_id
    )
    
    session.add(campaign)
    session.commit()
    session.refresh(campaign)
    
    return {
        "id": campaign.id,
        "name": campaign.name,
        "code": campaign.code,
        "image_path": campaign.image_path,
        "creator_id": campaign.creator_id
    }


# ============================================================================
# RÉCUPÉRER TOUTES LES CAMPAGNES D'UN USER
# ============================================================================

@router.get("/user/{user_id}")
def get_user_campaigns(
    user_id: int,
    session: Session = Depends(get_session),
) -> List[dict]:
    """Récupère toutes les campagnes créées par un utilisateur."""
    
    user = session.get(Users, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    campaigns = session.exec(
        select(Campaigns).where(Campaigns.creator_id == user_id)
    ).all()
    
    return [
        {
            "id": c.id,
            "name": c.name,
            "code": c.code,
            "description": c.description,
            "image_path": c.image_path,
            "creator_id": c.creator_id
        }
        for c in campaigns
    ]


# ============================================================================
# RÉCUPÉRER UNE CAMPAGNE PAR SON CODE
# ============================================================================

@router.get("/{code}")
def get_campaign_by_code(
    code: str,
    session: Session = Depends(get_session),
) -> dict:
    """Récupère les détails d'une campagne par son code."""
    
    campaign = session.exec(
        select(Campaigns).where(Campaigns.code == code)
    ).first()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Récupérer les personnages de la campagne
    sheets = session.exec(
        select(Sheets).where(Sheets.campaign_id == campaign.id)
    ).all()
    
    return {
        "id": campaign.id,
        "name": campaign.name,
        "code": campaign.code,
        "description": campaign.description,
        "image_path": campaign.image_path,
        "creator_id": campaign.creator_id,
        "sheets_count": len(sheets),
        "sheets": [{"id": s.id, "name": s.name} for s in sheets]
    }


# ============================================================================
# METTRE À JOUR UNE CAMPAGNE
# ============================================================================

@router.put("/{campaign_id}")
def update_campaign(
    campaign_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    image: UploadFile = File(None),
    session: Session = Depends(get_session),
) -> dict:
    """Met à jour une campagne."""
    
    campaign = session.get(Campaigns, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Mettre à jour les champs
    if name:
        campaign.name = name
    if description:
        campaign.description = description
    
    # Gérer la nouvelle image
    if image:
        # Supprimer l'ancienne image si elle existe
        if campaign.image_path and Path(campaign.image_path).exists():
            Path(campaign.image_path).unlink()
        
        # Sauvegarder la nouvelle image
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        image_path = f"images/{unique_filename}"
        
        file_location = IMAGES_DIR / unique_filename
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        campaign.image_path = image_path
    
    session.add(campaign)
    session.commit()
    session.refresh(campaign)
    
    return {
        "id": campaign.id,
        "name": campaign.name,
        "code": campaign.code,
        "image_path": campaign.image_path,
        "description": campaign.description
    }


# ============================================================================
# SUPPRIMER UNE CAMPAGNE
# ============================================================================

@router.delete("/{campaign_id}")
def delete_campaign(
    campaign_id: int,
    session: Session = Depends(get_session),
) -> dict:
    """Supprime une campagne et son image associée."""
    
    campaign = session.get(Campaigns, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Supprimer l'image si elle existe
    if campaign.image_path and Path(campaign.image_path).exists():
        Path(campaign.image_path).unlink()
    
    session.delete(campaign)
    session.commit()
    
    return {"message": f"Campaign '{campaign.name}' deleted"}


# ============================================================================
# RÉCUPÉRER L'IMAGE D'UNE CAMPAGNE
# ============================================================================

@router.get("/{campaign_id}/image", response_class=FileResponse)
def get_campaign_image(
    campaign_id: int,
    session: Session = Depends(get_session),
):
    """Récupère l'image d'une campagne."""
    
    campaign = session.get(Campaigns, campaign_id)
    if not campaign or not campaign.image_path:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image_file = Path(campaign.image_path)
    if not image_file.exists():
        raise HTTPException(status_code=404, detail="Image file not found")
    
    return FileResponse(image_file)
