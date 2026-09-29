# Shop Bijoux - Boutique avec Chatbot Conseiller IA

Boutique de bijoux avec interface chatbot qui recommande des produits basés sur la description du client.

## 🚀 Fonctionnalités

- **Catalogue bijoux** : affichage des produits avec prix
- **Panier** : ajout/suppression de produits, calcul du total
- **Chatbot conseiller** : l'IA recommande des bijoux selon les besoins du client
  - "Cadeau anniversaire, 50€" → recommande les 3 bijoux les plus adaptés
  - "Collier doré pas cher" → trouve les colliers à bon prix

## ⚙️ Installation

### 1. Cloner et dépendances

```bash
git clone <repo>
cd shop-bijoux
npm install
```

### 2. Clé API Google

1. Aller sur https://makersuite.google.com/app/apikey
2. Créer une clé API (gratuit, pas de carte bancaire)
3. Copier `.env.example` → `.env`
4. Ajouter votre clé :

```env
GOOGLE_API_KEY=AIz...
```

### 3. Lancer le serveur

```bash
npm start
```

Puis ouvrir http://localhost:3000

## 📝 Architecture

- **Frontend** : React (app.js) + Chatbot vanilla JS (chatbot.js)
- **Backend** : Express (server.js)
- **API IA** : Google Generative AI (Gemini)

### Endpoints

- `GET /` → Page HTML
- `POST /api/recommandations` → Chatbot
  - Input: `{ besoin: "description client" }`
  - Output: `{ conseil, produits_ids, produits, raison }`

## 🔒 Sécurité

⚠️ **Jamais exposer la clé API**:
- La clé doit être en `.env` (ignoré par git)
- Elle est utilisée **uniquement côté serveur**
- Le client communique via `/api/recommandations`

## 💡 Améliorations futures

1. Base de données des produits
2. Historique chat persistant
3. Traduction auto (FR/EN/ES)
4. Descriptions auto pour nouveaux produits
5. Recherche en langage naturel avancée
