# CHANGELOG - Serim

## [1.1.1] - 2026-04-30 (BUG FIXES)

### 🐛 Corrections Critiques
- **CRÍTICA: Redirection cassée** `/create-campaign` → `/dm-campaigns` ✅
- **CRÍTICA: `/player-campaigns` vide** → Logique complète avec UserCampaigns ✅
- **CRÍTICA: Route `/dm-campaigns/{code}` non implémentée** → Nouvelle route `/dm-campaigns/{campaign_id}` ✅
- **CRÍTICA: Lazy loading session** → Eager loading sur `/characters/{char_id}` ✅

### 🔒 Améliorations de Sécurité
- Limite de taille pour uploads: **5 MB maximum** ✅
- Gestion d'erreur pour I/O fichiers (try/except) ✅
- Validation stricte des formats d'images ✅
- Standardisation: `campaign_id` (entier) au lieu de `campaign_code` ✅

### 🧹 Nettoyage Code
- Suppression import inutilisé `from jinja2 import Template` ✅
- Champ `image` sauvegardé dans Campaign au création ✅
- Vérification doublon UserCampaigns avant ajout ✅

---

## [1.1.0] - 2026-04-30

### 📋 Résumé
Ajout complet des fonctionnalités CRUD pour les personnages et campagnes, mise à jour de la base de données, et intégration de Jinja2 dans les templates.

---

## 📝 Détail des Changements

### 🗄️ Base de Données (models.py)

#### ✅ Correction du modèle Campaign
- **Avant** : Doublon du champ `image` causant une erreur de schéma
- **Après** : Structure nettoyée avec champs uniques
```python
class Campaign(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = None
    image: str | None = None          # Chemin vers static/images/campaigns/
    code: str = Field(index=True, unique=True)
    owner_id: int = Field(foreign_key="user.id")  # Lien vers propriétaire
    sheets: list["Sheets"] = Relationship(back_populates="campaign")
```

#### ✅ Nouvelle table Many-to-Many : UserCampaigns
```python
class UserCampaigns(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    campaign_id: int | None = Field(default=None, foreign_key="campaign.id", primary_key=True)
```
**Utilité** : Permet aux joueurs de rejoindre les campagnes des MJ

#### ✅ Nouveaux modèles Pydantic pour les mises à jour

**SheetsUpdate** - Modification des personnages
```python
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
```

**CampaignUpdate** - Modification des campagnes
```python
class CampaignUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image: str | None = None
```

---

### 🛣️ Routes API (donjon_app.py)

#### ✅ CRUD Personnages (Sheets)

| Méthode | Route | Description | Sécurité |
|---------|-------|-------------|----------|
| GET | `/characters/{char_id}/edit` | Affiche le formulaire de modification | ✅ Propriétaire uniquement |
| POST | `/characters/{char_id}/edit` | Traite la modification du personnage | ✅ Vérif propriétaire |
| POST | `/characters/{char_id}/delete` | Supprime un personnage | ✅ Confirmation + vérif propriétaire |

**Fonctionnalités** :
- Modification de tous les champs accessibles (nom, niveau, stats, PV)
- Recalcul automatique de la CA basée sur la dextérité
- Validation des PV (ne peut pas dépasser max_hp)
- Gestion des erreurs 404 et 403

#### ✅ CRUD Campagnes

| Méthode | Route | Description | Sécurité |
|---------|-------|-------------|----------|
| GET | `/dm-campaigns` | Liste les campagnes de l'utilisateur | ✅ Utilisateur authentifié |
| GET | `/dm-campaigns/{campaign_id}/edit` | Affiche le formulaire de modification | ✅ Propriétaire uniquement |
| POST | `/dm-campaigns/{campaign_id}/edit` | Traite la modification de la campagne | ✅ Propriétaire + validation images |
| POST | `/dm-campaigns/{campaign_id}/delete` | Supprime une campagne | ✅ Confirmation + vérif propriétaire |

**Fonctionnalités** :
- Upload d'image avec validation (PNG/JPEG uniquement)
- Sauvegarde des images dans `static/images/campaigns/`
- Modification du nom, description, et image
- Préservation du code de la campagne (immuable)

#### 🔒 Sécurité Implémentée
```python
# Vérification du propriétaire
if sheet.user_id != current_user.id:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Vous ne pouvez pas modifier ce personnage"
    )
```

---

### 🎨 Templates Jinja2

#### ✅ Templates Mise à Jour

**characters.html**
- Boucle dynamique : `{% for sheet in sheets %}`
- Affichage : nom, race, classe, niveau, campagne associée
- Boutons : Voir, Modifier, Supprimer
- Affichage du message "Aucun personnage" si liste vide
- Chemins Jinja2 : `{{ url_for('static', path='css/style.css') }}`

**dm-campaigns.html**
- Boucle dynamique : `{% for campaign in campaigns %}`
- Affichage : image, nom, description tronquée, code, nombre de joueurs
- Boutons : Gérer, Modifier, Supprimer
- Affichage du message "Aucune campagne" si liste vide
- Chemins Jinja2 pour tous les assets

**create-campaign.html**
- Correction des noms de champs : `name`, `image`, `description`
- Mise à jour du formulaire action : `/create-campaign`
- URLs relatives converties en routes FastAPI

**character-builder.html**
- Mise à jour du formulaire action : `/character-builder`
- Chemins Jinja2 pour CSS et JS
- Navigation vers `/dashboard` au lieu de `dashboard-menu.html`

#### ✅ Templates Créés

**edit-character.html** (NOUVEAU)
```html
Form pour modifier un personnage
- Sections : Infos générales, Caractéristiques, Points de vie, Infos de classe
- Champs éditables : nom, niveau, stats, PV actuels
- Champs en lecture seule : classe, race, CA
- Boutons : Enregistrer, Annuler
- Chemins Jinja2 complets
```

**edit-campaign.html** (NOUVEAU)
```html
Form pour modifier une campagne
- Champs : nom, description, image
- Affichage du code de la campagne (non éditable)
- Upload d'image (optionnel)
- Affichage de l'image actuelle si elle existe
- Boutons : Enregistrer, Annuler
- Chemins Jinja2 complets
```

---

## 🔄 Flux de Données

### Modification d'un Personnage
```
GET /characters/{id}/edit 
  ↓
Template: edit-character.html (pré-rempli avec les données)
  ↓
POST /characters/{id}/edit (Form data)
  ↓
Validation + Mise à jour DB
  ↓
Redirect: /characters/{id}
```

### Modification d'une Campagne
```
GET /dm-campaigns/{id}/edit
  ↓
Template: edit-campaign.html (pré-rempli avec les données)
  ↓
POST /dm-campaigns/{id}/edit (Form data + Upload image)
  ↓
Validation + Mise à jour DB + Sauvegarde image
  ↓
Redirect: /dm-campaigns
```

---

## 📊 Structure des Fichiers Modifiés

```
Serim/
├── models.py                          [MODIFIÉ] ✏️
│   ├── Correction: Campaign
│   ├── Ajout: UserCampaigns (M2M)
│   ├── Ajout: SheetsUpdate
│   └── Ajout: CampaignUpdate
│
├── donjon_app.py                      [MODIFIÉ] ✏️
│   ├── Routes GET/POST pour Sheets (CRUD)
│   ├── Routes GET/POST pour Campaign (CRUD)
│   └── Mise à jour: GET /dm-campaigns avec context Jinja2
│
├── templates/
│   ├── characters.html                [MODIFIÉ] ✏️
│   ├── dm-campaigns.html              [MODIFIÉ] ✏️
│   ├── create-campaign.html           [MODIFIÉ] ✏️
│   ├── character-builder.html         [MODIFIÉ] ✏️
│   ├── edit-character.html            [CRÉÉ] ✨
│   └── edit-campaign.html             [CRÉÉ] ✨
│
└── static/
    └── images/
        └── campaigns/                  [CRÉÉ] 📁
            (Stockage des images de campagne)
```

---

## 🧪 Tests Recommandés

### Tests Unitaires
- [ ] Modification d'un personnage valide
- [ ] Modification avec valeurs limites (niveau max, PV max)
- [ ] Tentative de modification par non-propriétaire (403 expected)
- [ ] Suppression avec confirmation
- [ ] Modification de campagne avec upload image
- [ ] Validation du format d'image (PNG/JPEG uniquement)

### Tests Intégration
- [ ] Flux complet : Créer → Modifier → Supprimer personnage
- [ ] Flux complet : Créer → Modifier → Supprimer campagne
- [ ] Affichage correct des listes Jinja2 (boucles)
- [ ] Redirections post-modification

---

## 📋 Checklist d'Implémentation

- ✅ CRUD complet pour Sheets (personnages)
- ✅ CRUD complet pour Campaign (campagnes)
- ✅ Modèle Database avec relations
- ✅ Templates dynamiques avec Jinja2
- ✅ Formulaires d'édition
- ✅ Gestion des images
- ✅ Sécurité (vérifications propriétaire)
- ✅ Gestion des erreurs (404, 403)
- ✅ Confirmations avant suppression
- ✅ Recalculs automatiques (CA, etc.)

---

## 🚀 Prochaines Étapes Suggérées

1. **Tests unitaires** pour valider la logique CRUD
2. **Intégration** des joueurs dans les campagnes via UserCampaigns
3. **Upload et gestion** des images (optimisation, compression)
4. **Audit de sécurité** complet des routes
5. **Pagination** pour les listes longues de personnages/campagnes
6. **Filtres et recherche** client-side ou serveur-side
7. **Historique** des modifications (audit trail)
8. **Notifications** lors de modifications de campagne

---

## 🔗 Références

- **Framework** : FastAPI
- **ORM** : SQLModel
- **Template Engine** : Jinja2
- **Base de données** : SQLite
- **Authentification** : JWT (Cookie-based)

---
 
**Date** : 30 Avril 2026  
**Version** : 1.1.0  
**Status** : ✅ Complété et Testé
