#!/usr/bin/python3
import configparser
import requests
import uuid
from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List


class Sheets(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    level: int
    race: int
    classes: int
    spells: int | None = None
    armor: int | None = None
    weapon: int | None = None
    feats: int | None = None
    HP: int
    AC: int
    STR: int
    DEX: int
    CONST: int
    INT: int
    WIS: int
    CHAR: int
    
    users_id: int | None = Field(default=None, foreign_key="users.id")
    race_id: int | None = Field(default=None, foreign_key="race.id")
    class_id: int | None = Field(default=None, foreign_key="class.id")
    feats_id: int | None = Field(default=None, foreign_key="feats.id")
    spells_id: int | None = Field(default=None, foreign_key="spells.id")
    armors_id: int | None = Field(default=None, foreign_key="armors.id")
    weapons_id: int | None = Field(default=None, foreign_key="weapons.id")
    

  

class Users(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password_hash: str
    # Relations
    sheets: List["Sheets"] = Relationship(back_populates="users")


class Race(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    AC: int | None = None
    STR: int | None = None
    DEX: int | None = None
    CONST: int | None = None
    INT: int | None = None
    WIS: int | None = None
    CHAR: int | None = None
    HP: int | None = None
    # Relations
    sheets: List["Sheets"] = Relationship(back_populates="race")

class Class(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    AC: int | None = None
    STR: int | None = None
    DEX: int | None = None
    CONST: int | None = None
    INT: int | None = None
    WIS: int | None = None
    CHAR: int | None = None
    HP: int | None = None
    # Relations
    sheets: List["Sheets"] = Relationship(back_populates="class")

class Feats(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    description: str = None
    # Relations
    sheets: List["Sheets"] = Relationship(back_populates="feats")

class Spells(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    description: str = None
    level: int | None = None
    damage : str | None = None
    # Relations
    sheets: List["Sheets"] = Relationship(back_populates="spells")

class Armors(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    modifier: int | None = None
    type: str | None = None
    # Relations
    sheets: List["Sheets"] = Relationship(back_populates="armors")
                                        
class Weapons(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    damage: str | None = None
    type: str | None = None
    # Relations
    sheets: List["Sheets"] = Relationship(back_populates="weapons")


# ==========================================================================
# MANY-TO-MANY
# ==========================================================================

    
class SheetstoClass(SQLModel, table=True):
    sheet_id: int | None = Field(default=None, foreign_key="sheets.id", primary_key=True)
    class_id: int | None = Field(default=None, foreign_key="class.id", primary_key=True)

class SheetstoFeats(SQLModel, table=True):
    sheet_id: int | None = Field(default=None, foreign_key="sheets.id", primary_key=True)
    feats_id: int | None = Field(default=None, foreign_key="feats.id", primary_key=True)

class SheetstoSpells(SQLModel, table=True):
    sheet_id: int | None = Field(default=None, foreign_key="sheets.id", primary_key=True)
    spells_id: int | None = Field(default=None,foreign_key="spells.id", primary_key=True)

class SheetstoArmors(SQLModel, table=True):
    sheet_id: int | None = Field(default=None, foreign_key="sheets.id", primary_key=True)
    armors_id: int | None = Field(default=None, foreign_key="armors.id", primary_key=True)

class SheetstoWeapons(SQLModel, table=True):
    sheet_id: int | None = Field(default=None, foreign_key="sheets.id", primary_key=True)
    weapons_id: int | None = Field(default=None, foreign_key="weapons.id", primary_key=True)

