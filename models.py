from pydantic import BaseModel, EmailStr



#### SÉCURITÉ ####

class Token(BaseModel):
    access_token: str
    token_type: str

#### SÉCURITÉ ####

class Name(BaseModel):
    string: str
    optional_string: str | None = None
    float_data: float
    optional_float: float | None = None
    integer: int
    optional_integer: int | None = None

class Login(BaseModel):
    email: EmailStr
    password: str


class UserBase(BaseModel): #Création d'une base pour l'automatisation
    username: str #Nom utilisateur
    email: EmailStr #Email utilisateur

class UserIn(UserBase): #Création de la classe pour insérer un utilisateur
    password: str #Ajout du mot de passe utilisatU): #Créaeur au modèle UserBase

class UserOut(UserBase): #Création de la classe pour afficher l'utilisateur sans le mot de passe
    pass

class UserInDB(UserBase): #Création de la classe afin de sauvegarder un utilisateur dans la base de données
    hashed_password: str #Mot de passe encrypté par sécurité




