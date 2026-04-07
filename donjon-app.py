from fastapi import FastAPI, Request, HTTPException
import json
import os
# Import des modèles SQLModel incluant la nouvelle classe Partition
from models import Hero, Ordinateur, Employee, EmployeeOrdinateur, Partition, generate_badge_number
from fastapi.templating import Jinja2Templates
from fastapi import Request as Req
from fastapi.responses import HTMLResponse, RedirectResponse
from starlette.staticfiles import StaticFiles
from sqlmodel import create_engine, SQLModel, Session, select  

