document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    // Gestionnaire pour le bouton de paiement
    const checkoutBtn = document.getElementById('checkout-button');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            const panier = JSON.parse(localStorage.getItem('monPanier')) || [];
            
            if (panier.length === 0) {
                alert("Votre panier est vide. Ajoutez des billets avant de procéder au paiement.");
                e.preventDefault(); 
            }
            // Note : L'utilisateur sera redirigé par le lien <a> du HTML vers ../Paiement/paiement.html
        });
    }
});

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const subTotalElem = document.getElementById('sub-total');
    const finalTotalElem = document.getElementById('final-total');
    const fullCartContent = document.getElementById('full-cart-content');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    
    let panier = JSON.parse(localStorage.getItem('monPanier')) || [];

    // 1. GESTION DE L'AFFICHAGE (VIDE VS PLEIN)
    if (panier.length === 0) {
        if (fullCartContent) fullCartContent.classList.add('hidden');
        if (emptyCartMsg) emptyCartMsg.classList.remove('hidden');
        if (subTotalElem) subTotalElem.textContent = "0.00 €";
        if (finalTotalElem) finalTotalElem.textContent = "0.00 €";
        return;
    } else {
        if (fullCartContent) fullCartContent.classList.remove('hidden');
        if (emptyCartMsg) emptyCartMsg.classList.add('hidden');
    }

    // 2. GÉNÉRATION DES ARTICLES
    let totalPrix = 0;
    container.innerHTML = ""; 

    panier.forEach((produit, index) => {
        const qty = produit.quantite || 1;
        const prixLigne = parseFloat(produit.prix) * qty;
        totalPrix += prixLigne;

        // Vérification du chemin d'image pour éviter les erreurs
        // Si l'image commence déjà par "http" ou "asset", on ajuste selon la position du fichier HTML
        let imageSrc = produit.image;
        if (!imageSrc.startsWith('http')) {
            imageSrc = `../${imageSrc}`; // On remonte d'un dossier car panier.html est dans /Panier/
        }

        const itemHTML = `
            <article class="cart-item" role="row">
                <div class="item-info" role="cell">
                    <img src="${imageSrc}" class="item-thumb" alt="${produit.nom}" width="80" height="50" style="object-fit: cover; border-radius: 4px;">
                    <div class="item-details">
                        <span class="item-name">${produit.nom}</span>
                        <button class="btn-delete" onclick="supprimerItem(${index})" aria-label="Supprimer ${produit.nom}">
                            Supprimer
                        </button>
                    </div>
                </div>

                <div class="col-date" role="cell">
                    <span class="mobile-label">Date :</span>
                    <span>${produit.date || '23 Mai 2026'}</span>
                </div>
                
                <div class="col-qty" role="cell">
                    <span class="mobile-label">Quantité :</span>
                    <div class="qty-control">
                        <button onclick="changerQuantite(${index}, -1)" class="btn-qty" aria-label="Diminuer">-</button>
                        <span class="qty-number">${qty}</span>
                        <button onclick="changerQuantite(${index}, 1)" class="btn-qty" aria-label="Augmenter">+</button>
                    </div>
                </div>

                <div class="col-price" role="cell">
                    <span class="mobile-label">Prix :</span>
                    <span class="item-total-price">${prixLigne.toFixed(2)} €</span>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    });

    // 3. CALCUL DES TOTAUX
    const fraisReservation = 2.00;
    if (subTotalElem) subTotalElem.textContent = `${totalPrix.toFixed(2)} €`;
    if (finalTotalElem) finalTotalElem.textContent = `${(totalPrix + fraisReservation).toFixed(2)} €`;
}

// --- FONCTIONS GLOBALES (attachées à window pour le onclick du HTML) ---

window.changerQuantite = (index, delta) => {
    let panier = JSON.parse(localStorage.getItem('monPanier')) || [];
    if (!panier[index]) return;
    
    panier[index].quantite = (panier[index].quantite || 1) + delta;

    if (panier[index].quantite <= 0) {
        window.supprimerItem(index);
    } else {
        localStorage.setItem('monPanier', JSON.stringify(panier));
        renderCart();
    }
};

window.supprimerItem = (index) => {
    let panier = JSON.parse(localStorage.getItem('monPanier')) || [];
    panier.splice(index, 1);
    localStorage.setItem('monPanier', JSON.stringify(panier));
    renderCart();
};