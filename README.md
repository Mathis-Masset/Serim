# Serim - Gestionnaire de Campagnes D&D

<div align="center">

**Plateforme Web Collaborative pour Gérer vos Campagnes de Donjons & Dragons**

</div>

---

## Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Utilisation](#-utilisation)
- [Structure du Projet](#-structure-du-projet)
- [Sécurité](#-sécurité)
- [Technologies](#-technologies)
- [Contribution](#-contribution)

---

## À propos

**Serim** est une application web collaborative conçue pour les maîtres de jeu et les joueurs de D&D qui souhaitent gérer facilement leurs campagnes, personnages et joueurs en ligne.

L'application offre une interface intuitive pour :
- Créer et gérer des campagnes
- Construire et personnaliser vos personnages D&D
- Inviter d'autres joueurs via des codes d'accès
- Suivre l'évolution de votre partie en temps réel

---

## Fonctionnalités

### Authentification & Sécurité
- Inscription et connexion sécurisées
- Hachage des mots de passe avec **Argon2**
- Tokens JWT avec stockage **HttpOnly**
- Gestion des sessions persistantes
- Protection contre les attaques (XSS, CSRF, brute-force)

### Gestion des Utilisateurs
- Profil utilisateur personnalisable
- Récupération de mot de passe
- Gestion des sessions multiples

### Gestion des Personnages (CRUD)
- **Créer** : Fiche de personnage complète avec stats D&D
  - Classes, races, niveaux
  - Attributs (Force, Dextérité, Constitution, etc.)
  - Points de Vie (PV) et Armure (AC)
- **Lire** : Affichage détaillé et galerie des personnages
- **Modifier** : Édition complète des stats et infos
- **Supprimer** : Suppression sécurisée avec confirmation
- Calcul automatique des valeurs dérivées

### Gestion des Campagnes (CRUD)
- **Créer** : Nouvelle campagne avec image et description
- **Lire** : Liste et détails des campagnes
- **Modifier** : Édition des paramètres
- **Supprimer** : Suppression avec validation
- Codes d'accès uniques pour l'invitation
- Affectation de personnages aux campagnes

### Gestion des Joueurs & Campagnes
- Rejoindre une campagne via code d'accès
- Lister les joueurs d'une campagne
- Vue joueur vs vue maître du jeu
- Gestion des rôles (DM / Joueur)

### Interface Utilisateur
- Design responsive et intuitif
- Thème adapté à l'univers D&D
- Galerie d'images
- Tableaux de bord personnalisés

---

## Architecture

### Stack Technologique

```
┌─────────────────────────────────────┐
│        Frontend (HTML/CSS/JS)       │
│  - Jinja2 Templates                 │
│  - JavaScript interactif            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Backend (FastAPI/Python)       │
│  - Routes et Endpoints               │
│  - Authentification JWT              │
│  - Validation Pydantic               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Base de Données (SQLite)          │
│  - Utilisateurs                      │
│  - Personnages                       │
│  - Campagnes                         │
│  - Participations                    │
└─────────────────────────────────────┘
```

### Modèle de Données

**Entités principales** :
- `User` : Utilisateurs inscrits
- `Character` : Personnages jouables
- `Campaign` : Campagnes de jeu
- `Participation` : Lien Joueur-Campagne


## Utilisation

### Créer un Compte

1. Cliquez sur **"S'inscrire"**
2. Remplissez le formulaire
3. Cliquez sur **"Créer un compte"**

### Créer un Personnage

1. Allez dans **"Mes Personnages"**
2. Cliquez sur **"Nouveau Personnage"**
3. Remplissez les stats D&D
4. Cliquez sur **"Créer"**

### Créer une Campagne

1. Allez dans **"Mes Campagnes"**
2. Cliquez sur **"Nouvelle Campagne"**
3. Remplissez nom, description, image
4. Cliquez sur **"Créer"**

### Inviter des Joueurs

1. Ouvrez votre campagne
2. Partagez le **code d'accès** unique
3. Les joueurs cliquent sur **"Rejoindre une Campagne"**
4. Entrent le code et sélectionnent leur personnage

### Gérer une Campagne

- **Vue Maître du Jeu** : Voir tous les joueurs et personnages
- **Vue Joueur** : Voir les autres joueurs et la campagne
- Modifiez ou supprimez vos créations à tout moment

---

## Structure du Projet

```
Serim/
├── donjon_app.py           # Application principale (FastAPI)
├── db.py                   # Configuration base de données
├── donjon_db.py            # Initialisation DB
├── models.py               # Modèles SQLModel
├── requirements.txt        # Dépendances Python
├── static/                # Fichiers statiques
│   ├── css/               # Feuilles de style
│   ├── js/                # Scripts JavaScript
│   └── images/            # Images et assets
├── templates/             # Templates Jinja2
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dm-dashboard.html
│   ├── player-dashboard.html
│   ├── characters.html
│   ├── character-builder.html
│   ├── campaigns.html
│   └── ...
└── README.md
 
```

### Fichiers Clés

| Fichier | Description |
|---------|-------------|
| `donjon_app.py` | Application FastAPI, routage, authentification |
| `models.py` | Schémas de données (User, Character, Campaign) |
| `donjon_db.py` | Setup base de données SQLite |
| `requirements.txt` | Dépendances du projet |

---

## Sécurité

### Mesures de Sécurité Implémentées

**Authentification**
- Tokens JWT signés cryptographiquement
- Stockage en cookies HttpOnly (pas d'accès JavaScript)
- Expiration automatique des sessions

**Stockage des Mots de Passe**
- Hachage sécurisé avec **Argon2**
- Salting automatique
- Résistant aux attaques par brute-force

**Validation des Entrées**
- Schémas Pydantic strictes
- Validation des uploads (types MIME, taille max 5MB)
- Nettoyage des chaînes de caractères

**Protection du Site Web**
- **XSS** : Échappement automatique par Jinja2
- **CSRF** : Protection SameSite sur les cookies
- **Injection SQL** : SQLModel avec requêtes paramétrées

**Contrôle d'Accès**
- Vérification du propriétaire sur chaque action sensible
- Séparation des rôles (DM / Joueur)
- Isolation des données par utilisateur

**Gestion d'Erreurs**
- Messages d'erreur génériques pour l'utilisateur
- Logs détaillés en backend
- Codes HTTP appropriés (403, 404, 500)

---

## Technologies

### Backend
- **FastAPI** : Framework web haute performance
- **SQLModel** : ORM combinant SQLAlchemy + Pydantic
- **PyJWT** : Gestion des tokens JWT
- **Argon2-cffi** : Hachage cryptographique des mots de passe
- **Jinja2** : Moteur de templates HTML

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Mise en page responsive
- **JavaScript Vanilla** : Interactions client

### Infrastructure
- **Python 3.10+** : Langage
- **SQLite** : Base de données légère
- **Uvicorn** : Serveur ASGI haute performance

---

## Configuration Avancée

### Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
# Clé secrète (générer avec: python -c "import secrets; print(secrets.token_hex(32))")
SECRET_KEY=your-generated-key-here

# Expiration des tokens (en minutes)
ACCESS_TOKEN_EXPIRES_MINUTES=30

# Base de données
DATABASE_URL=sqlite:///./serim.db

# Mode debug
DEBUG=False
```

### Installation des Dépendances (Manuel)

```bash
# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### Lancer l'Application (Manuel)

```bash
# Development avec rechargement automatique
uvicorn donjon_app:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn donjon_app:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## Diagrammes & Documentation

Le projet inclut plusieurs diagrammes pour mieux comprendre l'architecture :

- **MCD (Modèle Conceptuel de Données)** : [DIAGRAMME_MCD.md](./DIAGRAMME_MCD.md)
- **MLD (Modèle Logique de Données)** : [DIAGRAMME_MLD.md](./DIAGRAMME_MLD.md)
- **Flux d'Authentification** : [FLUX_AUTHENTIFICATION.mmd](./FLUX_AUTHENTIFICATION.mmd)
- **Architecture Globale** : [ARCHITECTURE_GLOBALE.mmd](./ARCHITECTURE_GLOBALE.mmd)

---

## Troubleshooting

### Problème : "Python n'est pas reconnu"

**Solution** : Python n'est pas dans le PATH. Téléchargez Python 3.10+ et cochez **"Add Python to PATH"** lors de l'installation.

### Problème : Erreur "Policy d'exécution" PowerShell

**Solution** :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problème : Port 8000 déjà utilisé

**Solution** :
```bash
# Utiliser un autre port
uvicorn donjon_app:app --port 8001
```

### Problème : Erreur base de données

**Solution** :
```bash
# Supprimer et recréer la DB
rm serim.db
python donjon_app.py
```

---

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Forkez** le dépôt
2. **Créez** une branche (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Poussez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Directives

- Respectez le style de code existant
- Testez vos modifications
- Documentez les changements importants
- Utilisez des messages de commit clairs


---


## Remerciements

Remerciements spéciaux à :
- **FastAPI** pour l'excellent framework
- **SQLModel** pour l'ORM intuitif
- **Argon2** pour la sécurité des mots de passe
- La communauté D&D pour l'inspiration

---

## Feuille de Route

- [x] CRUD Personnages
- [x] CRUD Campagnes
- [x] Authentification JWT
- [x] Invitation par code
- [ ] Système de chat en temps réel
- [ ] Export PDF des personnages
- [ ] Historique des sessions
- [ ] Intégration Discord

---

## Auteurs

Projet alternatif CNAM 2025  
**Equipe** : Mathis MASSET | Pierre HERZOG | Lucila VANHALLE

**Tuteur** : Rezak AZIZ

---

## Merci d'utiliser Serim !

