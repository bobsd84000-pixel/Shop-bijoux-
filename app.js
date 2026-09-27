// Initialisation du panier à partir de localStorage
let panier = JSON.parse(localStorage.getItem('panier')) || [];

// Produits exemple
const produits = [
  { id: 1, nom: 'Collier Or', prix: 45.99 },
  { id: 2, nom: 'Bracelet Argent', prix: 32.50 },
  { id: 3, nom: 'Boucles Perles', prix: 28.99 },
  { id: 4, nom: 'Bague Diamant', prix: 89.99 },
  { id: 5, nom: 'Pendentif Cristal', prix: 55.00 },
  { id: 6, nom: 'Chaîne Or Rose', prix: 65.99 }
];

// Synchroniser le panier avec localStorage
function sauvegarderPanier() {
  localStorage.setItem('panier', JSON.stringify(panier));
  afficherPanier();
  mettreAJourCompteur();
}

// Afficher les produits
function afficherProduits() {
  const container = document.getElementById('produits-container');
  container.innerHTML = produits.map(p => `
    <li class="produit" role="listitem">
      <article aria-label="${p.nom}">
        <h3>${p.nom}</h3>
        <p class="prix" aria-label="Prix: ${p.prix} euros">${p.prix}€</p>
        <button onclick="ajouterAuPanier(${p.id}, '${p.nom}', ${p.prix})" aria-label="Ajouter ${p.nom} au panier">Ajouter</button>
      </article>
    </li>
  `).join('');
}

// Ajouter un produit au panier
function ajouterAuPanier(id, nom, prix) {
  const item = panier.find(p => p.id === id);
  if (item) {
    item.quantite++;
  } else {
    panier.push({ id, nom, prix, quantite: 1 });
  }
  sauvegarderPanier();
}

// Afficher le panier
function afficherPanier() {
  const container = document.getElementById('panier-container');
  const totalEl = document.getElementById('panier-total');

  if (panier.length === 0) {
    container.innerHTML = '<p class="panier-vide" role="status" aria-live="polite">Votre panier est vide</p>';
    totalEl.innerHTML = '';
    return;
  }

  container.innerHTML = panier.map(item => `
    <div class="panier-item" role="listitem">
      <div class="panier-item-info">
        <strong>${item.nom}</strong> - <span aria-label="Prix unitaire: ${item.prix} euros">${item.prix}€</span> x <span aria-label="Quantité: ${item.quantite}">${item.quantite}</span>
      </div>
      <div class="panier-item-actions">
        <button onclick="diminuerQuantite(${item.id})" aria-label="Réduire la quantité de ${item.nom}">-</button>
        <button onclick="supprimerDuPanier(${item.id})" aria-label="Supprimer ${item.nom} du panier">✕</button>
      </div>
    </div>
  `).join('');

  const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  totalEl.innerHTML = `<span aria-label="Total du panier: ${total.toFixed(2)} euros">Total: ${total.toFixed(2)}€</span>`;
  totalEl.setAttribute('role', 'status');
  totalEl.setAttribute('aria-live', 'polite');
}

// Diminuer la quantité
function diminuerQuantite(id) {
  const item = panier.find(p => p.id === id);
  if (item) {
    item.quantite--;
    if (item.quantite === 0) {
      panier = panier.filter(p => p.id !== id);
    }
    sauvegarderPanier();
  }
}

// Supprimer du panier
function supprimerDuPanier(id) {
  panier = panier.filter(p => p.id !== id);
  sauvegarderPanier();
}

// Mettre à jour le compteur
function mettreAJourCompteur() {
  const count = panier.reduce((sum, item) => sum + item.quantite, 0);
  const countEl = document.getElementById('panier-count');
  countEl.textContent = count;
  countEl.setAttribute('aria-label', `${count} article${count > 1 ? 's' : ''} dans le panier`);
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  afficherProduits();
  afficherPanier();
  mettreAJourCompteur();
});
