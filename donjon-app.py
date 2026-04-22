from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlmodel import create_engine, SQLModel, Session, select
from contextlib import asynccontextmanager
from pathlib import Path
from pydantic import BaseModel
import os

# Import des modèles depuis db.py
from db import (
    Users, Sheets, Race, Class, Feats, Spells, Armors, Weapons, Campaigns,
    SheetstoClass
)

# Import des routes
from campaigns_routes import router as campaigns_router

# ============================================================================
# Configuration de la base de données
# ============================================================================

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///database.db")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Crée les tables de la base de données si elles n'existent pas."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dépendance pour obtenir une session de base de données."""
    with Session(engine) as session:
        yield session

# ============================================================================
# Initialisation FastAPI
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager pour créer les tables au démarrage."""
    create_db_and_tables()
    yield

app = FastAPI(
    title="Serim - D&D Campaign Manager",
    description="Gestionnaire de campagnes D&D avec support d'images",
    version="1.0.0",
    lifespan=lifespan
)

# ============================================================================
# Configuration des fichiers statiques et templates
# ============================================================================

# Chemin vers les dossiers static et templates
BASE_DIR = Path(__file__).parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

# Montage des fichiers statiques (CSS, JS, images)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Configuration de Jinja2Templates
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# ============================================================================
# Routes des campagnes
# ============================================================================

# Ajouter les routes des campagnes
app.include_router(campaigns_router)

# ============================================================================
# Routes d'accueil et templates
# ============================================================================

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    """Page d'accueil avec template."""
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    """Page de connexion."""
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/register", response_class=HTMLResponse)
def register_page(request: Request):
    """Page d'inscription."""
    return templates.TemplateResponse("register.html", {"request": request})


@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request):
    """Dashboard principal."""
    return templates.TemplateResponse("dm-dashboard.html", {"request": request})


@app.get("/characters", response_class=HTMLResponse)
def characters_page(request: Request):
    """Page des personnages."""
    return templates.TemplateResponse("characters.html", {"request": request})


@app.get("/create-character", response_class=HTMLResponse)
def create_character_page(request: Request):
    """Page de création de personnage."""
    return templates.TemplateResponse("character-builder.html", {"request": request})


@app.get("/campaigns", response_class=HTMLResponse)
def campaigns_page(request: Request):
    """Page des campagnes."""
    return templates.TemplateResponse("dm-campaigns.html", {"request": request})


@app.get("/create-campaign", response_class=HTMLResponse)
def create_campaign_page(request: Request):
    """Page de création de campagne."""
    return templates.TemplateResponse("create-campaign.html", {"request": request})

# ============================================================================
# Santé check
# ============================================================================

@app.get("/health")
def health_check():
    """Vérification que l'API est en ligne."""
    return {"status": "OK"}

# ============================================================================
# Routes pour les Users
# ============================================================================

@app.post("/users/create")
def create_user(username: str, email: str, password_hash: str, session: Session = Depends(get_session)):
    """Crée un nouvel utilisateur."""
    
    # Vérifier que l'email n'existe pas déjà
    existing = session.exec(select(Users).where(Users.email == email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = Users(username=username, email=email, password_hash=password_hash)
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email
    }


@app.get("/users/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session)):
    """Récupère les informations d'un utilisateur."""
    user = session.get(Users, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "campaigns_count": len(user.campaigns) if user.campaigns else 0,
        "sheets_count": len(user.sheets) if user.sheets else 0
    }


# ============================================================================
# Routes d'authentification
# ============================================================================

class LoginRequest(BaseModel):
    """Modèle pour les requêtes de connexion."""
    email: str
    password: str


@app.post("/login/authenticate")
def login_authenticate(login_data: LoginRequest, session: Session = Depends(get_session)):
    """Authentifie un utilisateur avec email et mot de passe."""
    user = session.exec(select(Users).where(Users.email == login_data.email)).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Email not found")
    
    # NOTE: In production, use proper password hashing (bcrypt, argon2, etc.)
    # This is a simple comparison for now
    if user.password_hash != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email
    }


# ============================================================================
# Exécution de l'application
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
