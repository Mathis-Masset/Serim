from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Query, Path, Form, HTTPException, Request, status, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import *
from typing import Annotated, Literal
import jwt
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

# from db import Sheets, Users, Race, Class, Feats, Spells, Armors, Weapons, SheetstoArmors, SheetstoClass, SheetstoFeats, SheetstoSpells, SheetstoWeapons

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static") #Location des fichier statique css et js

templates = Jinja2Templates(directory="templates") #Location des pages html

## TEST AREA ##

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}


def fake_hash_password(password: str):
    return "fakehashed" + password


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class UserInDB(User):
    hashed_password: str


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def fake_decode_token(token):
    # This doesn't provide any security at all
    # Check the next version
    user = get_user(fake_users_db, token)
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.username, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user



## TEST AREA ##


#### SÉCURITÉ ####
SECRET_KEY = "c082b37ddfde3e7c5d7b643334b23027a31f67958ab76fddd9328d41fdebead0"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 30
password_hash = PasswordHash.recommended()

DUMMY_HASH = password_hash.hash("dummypassword") #Dummy hash afin d'empecher les brute force attacks en ralentissant l'identification

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") #Token d'authentification

#Vérification du mdp
def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

#Vérification du hashing du mdp
def get_password_hash(password):
    return password_hash.hash(password)

#Authentification de l'utilisateur
def authenticate_user(fake_db, username: str, password: str): ##CHANGER FAKE DB POUR REDIRIGER VERS LA DB RÉEL UNE FOIS IMPLÉMENTER
    user = get_user(fake_db, username)
    if not user:
        verify_password(password, DUMMY_HASH) #Vérification du mdp contre le dummy hash pour empécher les attaques
        return False
    if not verify_password(password, user.hashed_password):
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


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
#### SÉCURITÉ ####




@app.get("/") #Define route
def home(request: Request): #Define function async/sync
    return templates.TemplateResponse(request, "index.html")

@app.get("/register") #Modifier index.html pour que le bouton s'inscrire redirige vers cette fonction
def register(request: Request):
    return templates.TemplateResponse(request, "register.html")

@app.post("/register")
async def registerform(): #Paramatre = type de données attendu, créer un modèle pydantic

    #Fonction qui cré un utilisateur et l'ajoute à la base de donnée

    return

@app.get("/login")
def login(request: Request):
    return templates.TemplateResponse(request, "login.html")

@app.post("/login")
async def postlogin(data: Annotated[Login, Form()]):

    #Fonction pour vérifier les IDs de login puis redirection vers le dashboard

    return data


@app.get("/dashboard")
def dashboard(request: Request):

    #Fonction pour check si login

    return templates.TemplateResponse(request, "dashboard-menu.html")

@app.post("/dashboard")
async def getcampaign(data: Annotated[str, Form()]):
    
    #Fonction pour check si login

    #Fonction pour ajouter la campagne correspondant au code a la BDD de l'utilisateur

    return


@app.get("/dashboard/player/characters")
async def characters(request: Request):
    return templates.TemplateResponse(request, "characters.html")

@app.get("/dashboard/player/characters/{char_id}") #FONCTION EN ATTENTE DE LA PAGE HTML
async def character():
    return templates.TemplateResponse(request, "TOADD.html")

@app.get("dashboard/dm/campaigns")
def dm_campaigns(request: Request):
    return templates.TemplateResponse(request, "dm-campaigns.html")

@app.get("dashboard/player/campaigns")
def player_campaigns(request: Request):
    return templates.TemplateResponse(request, "player-campaigns.html")



# @app.get("/create-campaign")
# def create_campaign(request: Request):
#     return templates.TemplateResponse(request, "create-campaign.html")

# @app.get("/character-builder")
# def create_character(request: Request):
#     return templates.TemplateResponse(request, "character-builder.html")





#@app.post("/")


