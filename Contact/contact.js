document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        let hasError = false;
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            const errorHint = input.nextElementSibling;
            
            // Validation simple : champ vide
            if (!input.value.trim()) {
                showError(input, errorHint, "Ce champ est indispensable.");
                hasError = true;
            } 
            // Validation spécifique Email
            else if (input.type === 'email' && !validateEmail(input.value)) {
                showError(input, errorHint, "L'adresse email n'est pas valide.");
                hasError = true;
            } 
            else {
                removeError(input, errorHint);
            }
        });

        if (!hasError) {
            // Utilise l'alerte ou un toast si tu as importé la fonction
            alert("Merci ! Votre message a bien été envoyé."); 
            form.reset();
            
            // On nettoie les éventuelles classes de succès/erreur après reset
            inputs.forEach(input => {
                const hint = input.nextElementSibling;
                removeError(input, hint);
            });
        }
    });

    function showError(input, hint, message) {
        input.classList.add('is-invalid'); // Utilisation de is-invalid pour la cohérence
        if (hint && hint.classList.contains('error-hint')) {
            hint.textContent = message;
            hint.classList.add('is-visible'); // On gère l'affichage via une classe
        }
    }

    function removeError(input, hint) {
        input.classList.remove('is-invalid');
        if (hint && hint.classList.contains('error-hint')) {
            hint.textContent = '';
            hint.classList.remove('is-visible'); // On cache via la classe
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});