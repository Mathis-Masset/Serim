from pydantic import BaseModel, EmailStr
from sqlmodel import Field, SQLModel, Relationship



#### SÉCURITÉ ####

class Token(BaseModel):
    access_token: str
    token_type: str

#### SÉCURITÉ ####

### BASE DE DONNÉE ###

### Users ###

#Données basiques
class UserBase(SQLModel):
    username: str
    email: str

#Table SQL
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password: str

#Données publiques pour le client
class UserPub(UserBase):
    id: int

#Modèle utilisé pour la création, limite le passage du mdp
class UserCreate(UserBase):
    password: str

#Modèle utilisé pour le changement de données
class UserUpdate(UserBase):
    username: str | None = None
    email: str | None = None
    password: str | None = None

### Users ###

class Sheets(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    level: int
    strenght: int
    dexterity: int
    constitution: int
    intelligence: int
    wisdom: int
    charisma: int
    ac: int
    max_hp: int
    curr_hp: int
    db_wclass: int # TO LINK TO ANOTHER TABLE
    race: int # TO LINK TO ANOTHER TABLE
    feats: int | None = None # TO LINK TO ANOTHER TABLE
    weapons: int | None= None # TO LINK TO ANOTHER TABLE
    armor: int | None = None # TO LINK TO ANOTHER TABLE
    spells: int | None = None # TO LINK TO ANOTHER TABLE

class Race(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True) # LINK TO "race" IN SHEETS
    name: str
    features: str | None = None

class Class(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True) #LINK TO "class" IN SHEETS
    name: str
    hp: int
    level: int
    features: str | None = None

class Feats(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True) # LINK TO "Sheets_to_Feats"
    name: str
    features: str

class Weapons(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True) # LINK TO "Sheets_to_Weapons"
    name: str
    damage: int
    description: str | None = None

class Armors(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True) # LINK TO "Sheets_to_Armors"
    name: str
    AC: str
    description: str | None = None

class Spells(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True) # LINK TO "Sheets_to_Spells"
    name: str
    level: str
    damage: int | None = None
    description: str

class Campaign(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    image: str #pas sûr pour ça voir comment stocker les images
    code: str 
    players: int #Link to sheet id 1:N

### BASE DE DONNÉE ###




### MODÈLES PYDANTIC ###

class Login(BaseModel):
    email: EmailStr
    password: str

### MODÈLES PYDANTIC ###



