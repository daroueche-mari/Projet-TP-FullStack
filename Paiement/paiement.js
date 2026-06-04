document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GESTION DU PANIER ET AFFICHAGE DYNAMIQUE ---
    const summaryContainer = document.querySelector('.summary-items');
    const totalElement = document.querySelector('.summary-total .price');
    
    // Récupération du panier
    const panier = JSON.parse(localStorage.getItem('monPanier')) || [];

    // Sécurité : Si le panier est vide, retour à l'accueil
    if (panier.length === 0) {
        alert("Votre panier est vide. Vous allez être redirigé vers la billetterie.");
        window.location.href = "../index.html"; 
        return;
    }

    // Remplissage dynamique du récapitulatif
    let totalHT = 0;
    if (summaryContainer) {
        summaryContainer.innerHTML = ''; 

        panier.forEach(produit => {
            const qty = produit.quantite || 1;
            const prixTotalItem = parseFloat(produit.prix) * qty;
            
            const itemRow = document.createElement('div');
            itemRow.className = 'summary-item';
            itemRow.innerHTML = `
                <span>${produit.nom} x${qty}</span>
                <strong class="item-price">${prixTotalItem.toFixed(2)}€</strong>
            `;
            summaryContainer.appendChild(itemRow);
            totalHT += prixTotalItem;
        });
    }

    // Frais fixes de réservation
    const fraisReservation = 2.00;
    if (totalElement) {
        totalElement.textContent = `${(totalHT + fraisReservation).toFixed(2)} €`;
    }


    // --- 2. FORMATAGE DES CHAMPS CARTE ---
    const cardNumber = document.getElementById('card-number');
    const expiry = document.getElementById('expiry');

    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || "";
            e.target.value = formatted.substring(0, 19);
        });
    }

    if (expiry) {
        expiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9]/gi, '');
            if (value.length >= 2) {
                e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
            } else {
                e.target.value = value;
            }
        });
    }


    // --- 3. VALIDATION ET SOUMISSION ---
    const form = document.getElementById('payment-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    // Nettoyage : On utilise une classe au lieu de .style.borderColor
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (isValid) {
                alert("✨ Paiement validé ! Un email de confirmation a été envoyé.");
                
                // Vider le panier après succès
                localStorage.removeItem('monPanier');
                
                window.location.href = "../index.html";
            } else {
                // Focus sur le premier champ vide pour l'accessibilité
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) firstInvalid.focus();
            }
        });
    }
});