from pydantic import BaseModel, EmailStr
from sqlmodel import Field, SQLModel, Relationship



#### SÉCURITÉ ####

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

#### SÉCURITÉ ####



### BASE DE DONNÉE ###

### Users ###

#Données basiques
class UserBase(SQLModel):
    username: str
    email: str

#Table SQL
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str

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

### Users ###



### Données fixes ###

class Race(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    features: str | None = None

    #One to many
    sheets: list["Sheets"] = Relationship(back_populates="char_race")

class Class(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    hp: int
    level: int
    features: str | None = None

    #One to many
    sheets: list["Sheets"] = Relationship(back_populates="char_class")

class Feats(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    features: str

class Weapons(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    damage: int
    description: str | None = None

class Armors(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    AC: str
    description: str | None = None

class Spells(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    level: str
    damage: int | None = None
    description: str

### Données fixes ###

class Campaign(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = None
    image: str | None = None
    code: str = Field(index=True, unique=True)
    owner_id: int = Field(foreign_key="user.id")
    sheets: list["Sheets"] = Relationship(back_populates="campaign")


### Tables de liaison many to many ###

class SheetsWeapons(SQLModel, table=True):
    sheets_id: int | None = Field(default=None, foreign_key="sheets.id", primary_key=True)
    weapons_id: int | None = Field(default=None, foreign_key="weapons.id", primary_key=True)

class SheetsSpells(SQLModel, table=True):
    sheets_id: int | None = Field(default=None, foreign_key="sheets.id", primary_key=True)
    spells_id: int | None = Field(default=None, foreign_key="spells.id", primary_key=True)

class SheetsArmors(SQLModel, table=True):
    sheets_id: int | None = Field(default=None, foreign_key="sheets.id", primary_key=True)
    armors_id: int | None = Field(default=None, foreign_key="armors.id", primary_key=True)

class SheetsFeats(SQLModel, table=True):
    sheets_id: int | None = Field(default=None, foreign_key="sheets.id", primary_key=True)
    feats_id: int | None = Field(default=None, foreign_key="feats.id", primary_key=True)

### Tables de liaison many to many ###

class UserCampaigns(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    campaign_id: int | None = Field(default=None, foreign_key="campaign.id", primary_key=True)


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

    # Propriétaire de la fiche
    user_id: int = Field(foreign_key="user.id")

    # Relation many to one vers Class
    class_id: int = Field(foreign_key="class.id")
    char_class: Class | None = Relationship(back_populates="sheets")

    # Relation many to one vers Race 
    race_id: int = Field(foreign_key="race.id")
    char_race: Race | None = Relationship(back_populates="sheets")

    campaign_id: int | None = Field(default=None, foreign_key="campaign.id")
    campaign: Campaign | None = Relationship(back_populates="sheets")

    # Relations many to many 
    weapons: list[Weapons] = Relationship(link_model=SheetsWeapons)
    spells: list[Spells] = Relationship(link_model=SheetsSpells)
    armors: list[Armors] = Relationship(link_model=SheetsArmors)
    feats: list[Feats] = Relationship(link_model=SheetsFeats)


### MODÈLES PYDANTIC ###

class pydLogin(BaseModel):
    email: EmailStr
    password: str

class pydUser(BaseModel):
    username: str
    email: EmailStr

# Modèles pour mise à jour de Sheets
class SheetsUpdate(BaseModel):
    name: str | None = None
    level: int | None = None
    strenght: int | None = None
    dexterity: int | None = None
    constitution: int | None = None
    intelligence: int | None = None
    wisdom: int | None = None
    charisma: int | None = None
    curr_hp: int | None = None

# Modèles pour mise à jour de Campaign
class CampaignUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image: str | None = None

### MODÈLES PYDANTIC ###