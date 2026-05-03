from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Query, Path, Form, HTTPException, Request, status, Depends, Cookie, File, UploadFile
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordRequestForm
from models import *
from typing import Annotated, Literal
import jwt
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from donjon_db import create_db_and_tables, engine
from sqlmodel import SQLModel, Session, Field, Relationship, create_engine, select
import random
import string
import shutil
from pathlib import Path

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static") #Location des fichiers statiques css et js

templates = Jinja2Templates(directory="templates") #Location des pages html

## TEST AREA ##


## TEST AREA ##



#### SÉCURITÉ ####
SECRET_KEY = "c082b37ddfde3e7c5d7b643334b23027a31f67958ab76fddd9328d41fdebead0"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 30
password_hash = PasswordHash.recommended()

DUMMY_HASH = password_hash.hash("dummypassword") #Dummy hash afin d'empêcher les brute force attacks en ralentissant l'identification

#Vérification du mdp
def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

#Hashing du mdp
def get_password_hash(password):
    return password_hash.hash(password)

#Récupérer l'user dans la DB par username
def get_user(username: str) -> User | None:
    with Session(engine) as session:
        statement = select(User).where(User.username == username)
        return session.exec(statement).first()

#Récupérer l'user dans la DB par email
def get_user_by_email(email: str) -> User | None:
    with Session(engine) as session:
        statement = select(User).where(User.email == email)
        return session.exec(statement).first()

#Authentification de l'utilisateur
def authenticate_user(username: str, password: str) -> User | None:
    user = get_user(username)
    if not user:
        verify_password(password, DUMMY_HASH) #Vérification du mdp contre le dummy hash pour empêcher les attaques timing
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

#Création du token d'accès
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#Récupération de l'utilisateur courant via le cookie
async def get_current_user(access_token: str | None = Cookie(default=None)):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Non authentifié"
        )
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")
    
    user = get_user(username=token_data.username)
    if user is None:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user

#Alias pour les routes protégées
CurrentUser = Annotated[User, Depends(get_current_user)]

# Route OAuth2 pour la doc /docs
@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

#### SÉCURITÉ ####



### BASE DE DONNÉE ###

# Vérifie si une table contient déjà des données
def data_exists(session: Session, model) -> bool:
    return session.exec(select(model)).first() is not None

def create_classes():
    with Session(engine) as session:
        if data_exists(session, Class):
            return
        Barbare = Class(name="Barbare", hp=6, level=1, features="Rage: Vous entrez dans une rage et faite 5 de dégats supplémentaires")
        Rodeur = Class(name="Rôdeur", hp=4, level=1, features="Discression: Si vous attaquez depuis les ombres vous faites 6 de dégats supplémentaires (Vous devez ensuite vous re dissimulez)")
        Magicien = Class(name="Magicien", hp=2, level=1, features="Sorts: Vous pouvez utilisez des points de sorts afin de lancer des sorts. Les points de sorts sont récupérer après un long repos")
        session.add(Barbare)
        session.add(Rodeur)
        session.add(Magicien)
        session.commit()
        session.refresh(Barbare)
        session.refresh(Rodeur)
        session.refresh(Magicien)

def create_weapons():
    with Session(engine) as session:
        if data_exists(session, Weapons):
            return
        Hache = Weapons(name="Hâche", damage=12, description="Une hache à deux mains manié par les barbares. Utilise la Force")
        Dague = Weapons(name="Dague", damage=6, description="Une dague manié par les rodeurs. Utilise la Dextérité")
        Baton = Weapons(name="Bâton", damage=4, description="Un bâton manié par les magiciens. Utilise la Force")
        session.add(Hache)
        session.add(Dague)
        session.add(Baton)
        session.commit()
        session.refresh(Hache)
        session.refresh(Dague)
        session.refresh(Baton)

def create_spells():
    with Session(engine) as session:
        if data_exists(session, Spells):
            return
        sort1 = Spells(name="Lancer de feu", level="1", damage=6, description="Vous lancer une petite boule de feu.")
        sort2 = Spells(name="Lance de glâce", level="3", damage=8, description="Vous invoquez une lance de glace et la lancez à vos ennemis. Touches tous les ennemis dans la même ligne")
        sort3 = Spells(name="Chârme", level="6", description="Vous charmez un ennemi qui se plie a vos demandes pendant une minute.")
        session.add(sort1)
        session.add(sort2)
        session.add(sort3)
        session.commit()
        session.refresh(sort1)
        session.refresh(sort2)
        session.refresh(sort3)

def create_armors():
    with Session(engine) as session:
        if data_exists(session, Armors):
            return
        armure1 = Armors(name="Robe de magicien", AC="10", description="Une robe classique d'apprenti magicien")
        armure2 = Armors(name="Armure de cuir", AC="13", description="Une armure légère facilitant les mouvements")
        armure3 = Armors(name="Armure de plaque", AC="16", description="Une armure lourde protégeant sont porteur")
        session.add(armure1)
        session.add(armure2)
        session.add(armure3)
        session.commit()
        session.refresh(armure1)
        session.refresh(armure2)
        session.refresh(armure3)

def create_races():
    with Session(engine) as session:
        if data_exists(session, Race):
            return
        race1 = Race(name="Orc", features="Vous gagnez +2 en force")
        race2 = Race(name="Elf", features="Vous gagnez +2 en dexterité")
        race3 = Race(name="Humain", features="Vous gagnez +2 en intelligence")
        race4 = Race(name="Drakéide", features="Vous gagnez +2 en charisme")
        session.add(race1)
        session.add(race2)
        session.add(race3)
        session.add(race4)
        session.commit()
        session.refresh(race1)
        session.refresh(race2)
        session.refresh(race3)
        session.refresh(race4)

def create_feats():
    with Session(engine) as session:
        if data_exists(session, Feats):
            return
        feats1 = Feats(name="Sauvage", features="Vous pouvez relancé les dégats une fois si vous utilisez une arme à deux mains")
        feats2 = Feats(name="Ombre", features="Vous obtenez un bonus de +3 à vos jets de discrétions")
        feats3 = Feats(name="Concentration supérieure", features="Vous pouvez lancer deux sorts en un tour")
        session.add(feats1)
        session.add(feats2)
        session.add(feats3)
        session.commit()
        session.refresh(feats1)
        session.refresh(feats2)
        session.refresh(feats3)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    create_classes()
    create_weapons()
    create_spells()
    create_armors()
    create_races()
    create_feats()

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

### BASE DE DONNÉE ###



### FONCTIONS UTILITAIRES ###

# Génère un code unique de 5 caractères (lettres majuscules + chiffres)
def generate_unique_code(session: Session) -> str:
    characters = string.ascii_uppercase + string.digits
    while True:
        code = "".join(random.choices(characters, k=5))
        existing = session.exec(
            select(Campaign).where(Campaign.code == code)
        ).first()
        if not existing:
            return code

### FONCTIONS UTILITAIRES ###



#### ROUTES PUBLIQUES ####

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(request, "index.html")

@app.get("/register")
def register(request: Request):
    return templates.TemplateResponse(request, "register.html")

@app.post("/register")
async def registerUser(
    session: SessionDep,
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...)
):
    # Vérifier que le username n'existe pas déjà
    existing_username = session.exec(
        select(User).where(User.username == username)
    ).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Ce nom d'utilisateur est déjà utilisé")

    # Vérifier que l'email n'existe pas déjà
    existing_email = session.exec(
        select(User).where(User.email == email)
    ).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    # Créer l'utilisateur
    hashed_password = get_password_hash(password)
    db_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Connexion automatique après inscription
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username},
        expires_delta=access_token_expires
    )
    response = RedirectResponse(url="/dashboard", status_code=302)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRES_MINUTES * 60,
        samesite="lax"
    )
    return response

@app.get("/login")
def login(request: Request):
    return templates.TemplateResponse(request, "login.html")

@app.post("/login")
async def postlogin(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()]
):
    user = get_user_by_email(email)

    if not user:
        verify_password(password, DUMMY_HASH)
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect"
        )

    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    response = RedirectResponse(url="/dashboard", status_code=302)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRES_MINUTES * 60,
        samesite="lax"
    )
    return response

@app.get("/logout")
async def logout():
    response = RedirectResponse(url="/login", status_code=302)
    response.delete_cookie("access_token")
    return response

@app.post("/login/forgotten-password")
async def forgotpassword(data: Annotated[str, Form()]):
    #Fonction check email in DB
    #Fonction envoi mail
    return data

@app.get("/reset-password")
async def resetpassword(request: Request):
    return templates.TemplateResponse(request, "reset-password.html")

#### ROUTES PUBLIQUES ####



#### ROUTES PROTÉGÉES ####

@app.get("/dashboard")
def dashboard(request: Request, current_user: CurrentUser):
    with Session(engine) as session:
        available_sheets = session.exec(
            select(Sheets).where(
                Sheets.user_id == current_user.id,
                Sheets.campaign_id.is_(None)
            )
        ).all()

        for sheet in available_sheets:
            loader = sheet.char_class
            loader = sheet.char_race

    return templates.TemplateResponse(request, "dashboard-menu.html", context={"user": current_user, "sheets": available_sheets})

@app.get("/characters")
async def characters(request: Request, current_user: CurrentUser):
    with Session(engine) as session:
        sheets = session.exec(
            select(Sheets).where(Sheets.user_id == current_user.id)
        ).all()

        for sheet in sheets:
            loader = sheet.char_class
            loader = sheet.char_race
            loader = sheet.campaign

    return templates.TemplateResponse(
        request,
        "characters.html",
        context={"sheets": sheets, "user": current_user}
    )

@app.get("/characters/{char_id}")
async def character(request: Request, char_id: int, current_user: CurrentUser):
    with Session(engine) as session:
        sheet = session.get(Sheets, char_id)

        if not sheet:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Personnage introuvable")
        if sheet.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès interdit")

        loader = sheet.char_class
        loader = sheet.char_race
        loader = sheet.campaign

        owner = None
        if sheet.campaign:
            owner = session.get(User, sheet.campaign.owner_id)

    return templates.TemplateResponse(
        request,
        "player-dashboard.html",
        context={"sheet": sheet, "owner": owner, "user": current_user}
    )

@app.get("/characters/{char_id}/edit")
async def edit_character_page(request: Request, char_id: int, current_user: CurrentUser):
    with Session(engine) as session:
        sheet = session.get(Sheets, char_id)

        if not sheet:
            raise HTTPException(status_code=404, detail="Personnage introuvable")
        if sheet.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Accès interdit")

        loader = sheet.char_class
        loader = sheet.char_race

        classes = session.exec(select(Class.name)).all()
        species = session.exec(select(Race.name)).all()

    return templates.TemplateResponse(
        request,
        "character-builder.html",
        context={"sheet": sheet, "classes": classes, "species": species, "user": current_user}
    )

@app.post("/characters/{char_id}/delete")
async def delete_character(char_id: int, current_user: CurrentUser):
    with Session(engine) as session:
        sheet = session.get(Sheets, char_id)

        if not sheet:
            raise HTTPException(status_code=404, detail="Personnage introuvable")
        if sheet.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Accès interdit")

        session.delete(sheet)
        session.commit()

    return {"message": "Personnage supprimé avec succès"}

@app.get("/character-builder")
async def create_character(request: Request, current_user: CurrentUser):
    with Session(engine) as session:
        classes = session.exec(select(Class.name)).all()
        species = session.exec(select(Race.name)).all()
        weapons = session.exec(select(Weapons.name)).all()
    return templates.TemplateResponse(
        request,
        "character-builder.html",
        context={"classes": classes, "species": species, "weapons": weapons}
    )

@app.post("/character-builder")
async def postcharacter(
    current_user: CurrentUser,
    character_name: str = Form(alias="character-name"),
    level: int = Form(default=1),
    class_choice: str = Form(alias="class-choice"),
    species_choice: str = Form(alias="species-choice"),
    strength: int = Form(...),
    dexterity: int = Form(...),
    constitution: int = Form(...),
    intelligence: int = Form(...),
    wisdom: int = Form(...),
    charisma: int = Form(...),
):
    with Session(engine) as session:
        char_class = session.exec(
            select(Class).where(Class.name == class_choice)
        ).first()
        if not char_class:
            raise HTTPException(status_code=404, detail=f"Classe '{class_choice}' introuvable")

        char_race = session.exec(
            select(Race).where(Race.name == species_choice)
        ).first()
        if not char_race:
            raise HTTPException(status_code=404, detail=f"Race '{species_choice}' introuvable")

        con_modifier = (constitution - 10) // 2
        max_hp = char_class.hp + con_modifier

        dex_modifier = (dexterity - 10) // 2
        ac = 10 + dex_modifier

        sheet = Sheets(
            name=character_name,
            level=level,
            strength=strength,
            dexterity=dexterity,
            constitution=constitution,
            intelligence=intelligence,
            wisdom=wisdom,
            charisma=charisma,
            ac=ac,
            max_hp=max_hp,
            curr_hp=max_hp,
            user_id=current_user.id,
            class_id=char_class.id,
            race_id=char_race.id
        )
        session.add(sheet)
        session.commit()
        session.refresh(sheet)

    return RedirectResponse(url="/characters", status_code=302)

@app.get("/player-campaigns")
def player_campaigns(request: Request, current_user: CurrentUser):
    with Session(engine) as session:
        user_campaigns = session.exec(
            select(UserCampaigns).where(UserCampaigns.user_id == current_user.id)
        ).all()

        campaigns = []
        for uc in user_campaigns:
            campaign = session.get(Campaign, uc.campaign_id)
            if campaign:
                assigned_sheet = session.exec(
                    select(Sheets).where(
                        Sheets.user_id == current_user.id,
                        Sheets.campaign_id == campaign.id
                    )
                ).first()

                
                if assigned_sheet:
                    loader = assigned_sheet.char_class
                    loader = assigned_sheet.char_race

                owner = session.get(User, campaign.owner_id)

                campaigns.append({
                    "campaign": campaign,
                    "assigned_sheet": assigned_sheet,
                    "owner": owner
                })

        available_sheets = session.exec(
            select(Sheets).where(
                Sheets.user_id == current_user.id,
                Sheets.campaign_id.is_(None)
            )
        ).all()

        for sheet in available_sheets:
            loader = sheet.char_class
            loader = sheet.char_race

    return templates.TemplateResponse(
        request,
        "player-campaigns.html",
        context={
            "campaigns": campaigns,
            "available_sheets": available_sheets,
            "user": current_user
        }
    )

@app.post("/player-campaigns")
async def join_campaign(current_user: CurrentUser, code: str = Form()):
    with Session(engine) as session:
        campaign = session.exec(
            select(Campaign).where(Campaign.code == code)
        ).first()

        if not campaign:
            raise HTTPException(status_code=404, detail="Code invalide")

        already_joined = session.exec(
            select(UserCampaigns).where(
                UserCampaigns.user_id == current_user.id,
                UserCampaigns.campaign_id == campaign.id
            )
        ).first()

        if already_joined:
            raise HTTPException(status_code=400, detail="Campagne déjà rejointe")

        user_campaign = UserCampaigns(user_id=current_user.id, campaign_id=campaign.id)
        session.add(user_campaign)
        session.commit()

        campaign_name = campaign.name
        campaign_id = campaign.id
        campaign_code = campaign.code

    return {
        "campaignName": campaign_name,
        "campaignId": campaign_id,
        "campaignCode": campaign_code
    }


@app.get("/player-campaigns/{campaign_id}")
async def player_campaign(request: Request, campaign_id: int, current_user: CurrentUser):
    with Session(engine) as session:
        campaign = session.get(Campaign, campaign_id)

        if not campaign:
            raise HTTPException(status_code=404, detail="Campagne introuvable")

        membership = session.exec(
            select(UserCampaigns).where(
                UserCampaigns.user_id == current_user.id,
                UserCampaigns.campaign_id == campaign_id
            )
        ).first()

        if not membership:
            raise HTTPException(status_code=403, detail="Vous n'êtes pas dans cette campagne")

        assigned_sheet = session.exec(
            select(Sheets).where(
                Sheets.user_id == current_user.id,
                Sheets.campaign_id == campaign_id
            )
        ).first()

        available_sheets = session.exec(
            select(Sheets).where(
                Sheets.user_id == current_user.id,
                Sheets.campaign_id.is_(None)
            )
        ).all()

        for sheet in available_sheets:
            loader = sheet.char_class
            loader = sheet.char_race

        if assigned_sheet:
            loader = assigned_sheet.char_class
            loader = assigned_sheet.char_race

    return templates.TemplateResponse(
        request,
        "player-campaigns.html",
        context={
            "campaign": campaign,
            "assigned_sheet": assigned_sheet,
            "available_sheets": available_sheets,
            "user": current_user
        }
    )

@app.post("/player-campaigns/{campaign_id}/assign")
async def assign_character(
    campaign_id: int,
    current_user: CurrentUser,
    sheet_id: int = Form(...)
):
    with Session(engine) as session:
        membership = session.exec(
            select(UserCampaigns).where(
                UserCampaigns.user_id == current_user.id,
                UserCampaigns.campaign_id == campaign_id
            )
        ).first()

        if not membership:
            raise HTTPException(status_code=403, detail="Vous n'êtes pas membre de cette campagne")

        sheet = session.get(Sheets, sheet_id)

        if not sheet:
            raise HTTPException(status_code=404, detail="Personnage introuvable")

        if sheet.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Accès interdit")

        if sheet.campaign_id is not None:
            raise HTTPException(status_code=400, detail="Ce personnage est déjà dans une campagne")

        sheet.campaign_id = campaign_id
        session.add(sheet)
        session.commit()

    return RedirectResponse(url=f"/player-campaigns/{campaign_id}", status_code=302)

@app.get("/dm-campaigns")
def dm_campaigns(request: Request, current_user: CurrentUser):
    with Session(engine) as session:
        campaigns = session.exec(
            select(Campaign).where(Campaign.owner_id == current_user.id)
        ).all()
    return templates.TemplateResponse(
        request,
        "dm-campaigns.html",
        context={"campaigns": campaigns, "user": current_user}
    )


@app.get("/dm-campaigns/{campaign_code}")
def get_campaign(request: Request, campaign_code: str, current_user: CurrentUser):
    with Session(engine) as session:
        campaign = session.exec(
            select(Campaign).where(Campaign.code == campaign_code)
        ).first()

        if not campaign:
            raise HTTPException(status_code=404, detail="Campagne introuvable")

        if campaign.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Accès interdit")

        sheets = session.exec(
            select(Sheets).where(Sheets.campaign_id == campaign.id)
        ).all()

        for sheet in sheets:
            loader = sheet.char_class
            loader = sheet.char_race
            laoder = sheet.player

    return templates.TemplateResponse(request, "dm-dashboard.html", context={
        "campaign": campaign, 
        "sheets": sheets, 
        "user": current_user
        }
    )

@app.get("/create-campaign")
async def create_campaign(request: Request, current_user: CurrentUser, campaign_code: str | None = None):
    campaign = None

    if campaign_code:
        with Session(engine) as session:
            campaign = session.exec(
                select(Campaign).where(Campaign.code == campaign_code)
            ).first()

            if not campaign:
                raise HTTPException(status_code=404, detail="Campagne introuvable")
            if campaign.owner_id != current_user.id:
                raise HTTPException(status_code=403, detail="Accès interdit")

    return templates.TemplateResponse(request, "create-campaign.html", context={"campaign": campaign, "user": current_user})

@app.post("/create-campaign")
async def post_campaign(
    current_user: CurrentUser, 
    campaignTitle: str = Form(...), 
    description: str = Form(default=""), 
    banner: UploadFile = File(default=None)
):
    image_path = None
    if banner and banner.filename:
        if banner.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Format d'image non supporté")

        save_dir = Path("static/images/campaigns")
        save_dir.mkdir(parents=True, exist_ok=True)
        image_path = str(save_dir / banner.filename)

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(banner.file, buffer)

    with Session(engine) as session:
        code = generate_unique_code(session)

        campaign = Campaign(
            name=campaignTitle,
            description=description,
            image=image_path,
            code=code,
            owner_id=current_user.id
        )
        session.add(campaign)
        session.commit()
        session.refresh(campaign)

    return RedirectResponse(url=f"/dm-campaigns/{campaign.code}", status_code=302)


@app.post("/dm-campaigns/{campaign_code}/delete")
async def delete_campaign(campaign_code: str, current_user: CurrentUser):
    with Session(engine) as session:
        campaign = session.exec(
            select(Campaign).where(Campaign.code == campaign_code)
        ).first()

        if not campaign:
            raise HTTPException(status_code=404, detail="Campagne introuvable")
        if campaign.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Accès interdit")

        sheets = session.exec(
            select(Sheets).where(Sheets.campaign_id == campaign.id)
        ).all()
        for sheet in sheets:
            sheet.campaign_id = None
            session.add(sheet)

        user_campaigns = session.exec(
            select(UserCampaigns).where(UserCampaigns.campaign_id == campaign.id)
        ).all()
        for uc in user_campaigns:
            session.delete(uc)

        session.delete(campaign)
        session.commit()

    return {"message": f"Campagne {campaign_code} supprimée avec succès"}


#### ROUTES PROTÉGÉES ####
