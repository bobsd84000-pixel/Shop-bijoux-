# localStorage — Guide Panier

## Concept
localStorage persiste les données côté client, survit aux rechargements de page.

## Syntaxe

### Sauvegarder
```javascript
localStorage.setItem('panier', JSON.stringify(panier));
```
- `setItem(clé, valeur)` — stocke en format string
- `JSON.stringify()` — convertit objet → string

### Récupérer
```javascript
const panier = JSON.parse(localStorage.getItem('panier')) || [];
```
- `getItem(clé)` — récupère la string (ou null si absent)
- `JSON.parse()` — convertit string → objet
- `|| []` — fallback si absent ou null

## Limitations
- **Max 5-10 MB** par domaine (selon navigateur)
- **Synchrone** → peut ralentir pour gros volumes
- **String only** → JSON.stringify/parse obligatoires
- **Pas de sécurité** → accessible au JavaScript

## Exemple Complet (app.js)

```javascript
// Init
let panier = JSON.parse(localStorage.getItem('panier')) || [];

// Sauvegarder après chaque modification
function sauvegarderPanier() {
  localStorage.setItem('panier', JSON.stringify(panier));
}

// Ajouter un item
function ajouterAuPanier(id, nom, prix) {
  const item = panier.find(p => p.id === id);
  if (item) item.quantite++;
  else panier.push({ id, nom, prix, quantite: 1 });
  sauvegarderPanier();
}
```

## Bonus : Nettoyer
```javascript
localStorage.removeItem('panier');  // Supprime une clé
localStorage.clear();               // Vide tout
```

## Alternatives
- **sessionStorage** — disparaît à la fermeture du tab
- **IndexedDB** — base de données client (complexe, puissant)
- **API Serveur** — persistance vraie (recommandé pour app réelle)
