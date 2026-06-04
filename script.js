document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION API OPENAGENDA (Connexion directe sans proxy) ---
    const API_KEY = 'a051712ded454a5a999ceebfef9739c3';
    const AGENDA_UID = '50100'; // Agenda "La classe, l'œuvre !"
    // Utilisation directe de l'URL d'OpenAgenda
    const OPEN_AGENDA_URL = `https://api.openagenda.com/v2/agendas/${AGENDA_UID}/events?key=${API_KEY}&limit=100`;

    // --- 2. VARIABLES GLOBALES ---
    let allEventsData = [];
    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 6;

    // --- 3. SÉLECTEURS DOM ---
    const eventsContainer = document.getElementById('events-container');
    const eventTemplate = document.getElementById('event-template');
    const liveContainer = document.getElementById('live-container');
    const liveTemplate = document.getElementById('live-card-template');
    const filterButtons = document.querySelectorAll('.filter-link');
    const pageNumbersContainer = document.getElementById('page-numbers');

    // Données des Lives (Local)
    const livesData = [
        { id: 'live_1', name: "Omran Soliman", photo: "asset/artist-image/omran-soliman.webp", quote: "Session acoustique en live." },
        { id: 'live_2', name: "Anthony Shkraba", photo: "asset/artist-image/shkraba-anthony.webp", quote: "La création en direct dans l'atelier." },
        { id: 'live_3', name: "Greyson Joralemon", photo: "asset/artist-image/greyson-joralemon.webp", quote: "Ambiance électrique pour ce set !" }
    ];

    // --- 4. RÉCUPÉRATION DES DONNÉES (API DIRECTE) ---
    async function fetchOpenAgenda() {
        try {
            // Appel direct à l'API OpenAgenda
            const response = await fetch(OPEN_AGENDA_URL); 
            if (!response.ok) throw new Error("Erreur de chargement de l'API OpenAgenda");
            
            const data = await response.json();

            // Vérification de la présence des événements
            if (!data.events) return;

            allEventsData = data.events.map(event => {
                // Extraction et normalisation des textes textuels
                const title = (event.title?.fr || "").toLowerCase();
                const desc = (event.description?.fr || "").toLowerCase();
                const text = title + " " + desc;
                
                // Logique de répartition par catégories
                let cat = 'event'; 
                if (text.includes('peinture') || text.includes('cyanotype') || text.includes('visuel')) cat = 'visuels';
                else if (text.includes('musique') || text.includes('théâtre') || text.includes('spectacle')) cat = 'spectacle';
                else if (text.includes('musée') || text.includes('patrimoine')) cat = 'patrimoine';
                else if (text.includes('livre') || text.includes('cinéma') || text.includes('conte')) cat = 'lettres';

                // Image provenant directement des serveurs d'OpenAgenda v2
                let imgSource = 'asset/default.webp';
                if (event.image && event.image.base && event.image.filename) {
                    imgSource = event.image.base + event.image.filename;
                }

                // Récupération de la date
                let eventDate = "23 Mai 2026";
                if (event.firstTiming?.begin) {
                    eventDate = new Date(event.firstTiming.begin).toLocaleDateString('fr-FR');
                } else if (event.timings?.[0]?.start) {
                    eventDate = new Date(event.timings[0].start).toLocaleDateString('fr-FR');
                }

                return {
                    uid: event.uid,
                    name: event.title?.fr || "Événement culturel",
                    img: imgSource,
                    date: eventDate,
                    category: cat,
                    price: 20,
                    desc: event.description?.fr ? event.description.fr.substring(0, 100) + "..." : "Découvrez ce projet."
                };
            });

            // Mise à jour de l'affichage HTML
            updateDisplay();
            console.log("✅ Données chargées directement depuis OpenAgenda !");

        } catch (error) {
            console.error("Erreur API OpenAgenda :", error);
            const container = document.getElementById('events-container');
            if (container) container.innerHTML = "<p>Erreur lors de la récupération des événements en direct.</p>";
        }
    }

    // --- 5. AFFICHAGE ET FILTRAGE ---
    function updateDisplay() {
        if (!eventsContainer || !eventTemplate) return;

        const filteredData = allEventsData.filter(ev => currentFilter === 'all' || ev.category === currentFilter);
        const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * itemsPerPage;
        const pagedData = filteredData.slice(start, start + itemsPerPage);

        eventsContainer.innerHTML = '';

        if (pagedData.length === 0) {
            eventsContainer.innerHTML = '<p class="info-message">Aucun événement trouvé dans cette catégorie.</p>';
        }

        pagedData.forEach(event => {
            const clone = eventTemplate.content.cloneNode(true);
            
            const card = clone.querySelector('.event-card');
            card.style.cursor = "pointer";
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-add-to-cart')) {
                    window.location.href = `event-detail.html?id=${event.uid}`;
                }
            });

            clone.querySelector('.event-img').src = event.img;
            clone.querySelector('.event-title').textContent = event.name;
            clone.querySelector('.event-date-badge').textContent = event.date;
            clone.querySelector('.event-desc').textContent = event.desc;
            clone.querySelector('.event-price').textContent = `${event.price}€`;

            const btn = clone.querySelector('.btn-add-to-cart');
            btn.dataset.name = event.name;
            btn.dataset.price = event.price;
            btn.dataset.image = event.img;

            eventsContainer.appendChild(clone);
        });

        updatePageNumbers(totalPages);
    }

    function updatePageNumbers(totalPages) {
        if (!pageNumbersContainer) return;
        pageNumbersContainer.innerHTML = '';
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-link ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                updateDisplay();
                document.querySelector('.filters-section')?.scrollIntoView({ behavior: 'smooth' });
            };
            pageNumbersContainer.appendChild(btn);
        }
    }

    // --- 6. GESTION DES LIVES ---
    function initLives() {
        if (!liveContainer || !liveTemplate) return;
        liveContainer.innerHTML = '';
        livesData.forEach(live => {
            const clone = liveTemplate.content.cloneNode(true);
            clone.querySelector('.name').textContent = live.name;
            clone.querySelector('.quote').textContent = `"${live.quote}"`;
            clone.querySelector('.avatar').src = live.photo;

            const placeholder = document.createElement('div');
            placeholder.className = 'video-container-placeholder water-surface';
            placeholder.innerHTML = `
                <div class="video-preview">
                    <img src="asset/vignette-video/vignette.webp" alt="Aperçu" class="preview-img">
                    <div class="water-overlay"></div>
                    <div class="play-overlay">▶</div>
                </div>`;
            clone.querySelector('.live-card').prepend(placeholder);
            liveContainer.appendChild(clone);
        });
    }

    // --- 7. ÉCOUTEURS D'ÉVÉNEMENTS (CLICS) ---
    document.addEventListener('click', (e) => {
        // Toggle Video
        if (e.target.classList.contains('btn-toggle-live')) {
            const btn = e.target;
            const card = btn.closest('.live-card');
            const placeholder = card.querySelector('.video-container-placeholder');
            
            if (placeholder.querySelector('video')) {
                placeholder.innerHTML = `<div class="video-preview"><img src="asset/vignette-video/vignette.webp" class="preview-img"><div class="water-overlay"></div><div class="play-overlay">▶</div></div>`;
                btn.textContent = "▶ Voir le direct";
                btn.classList.remove('is-actived');
            } else {
                placeholder.innerHTML = `<video controls autoplay class="live-video-player"><source src="asset/video/live-stream.mp4" type="video/mp4"></video>`;
                btn.classList.add('is-actived');
                btn.textContent = "✖ Fermer le direct";
            }
        }

        // Panier
        if (e.target.classList.contains('btn-add-to-cart')) {
            const btn = e.target;
            let panier = JSON.parse(localStorage.getItem('monPanier')) || [];
            
            const produit = { 
                nom: btn.dataset.name, 
                prix: btn.dataset.price, 
                image: btn.dataset.image, 
                quantite: 1 
            };

            const existant = panier.find(p => p.nom === produit.nom);
            if (existant) {
                existant.quantite++;
            } else {
                panier.push(produit);
            }

            localStorage.setItem('monPanier', JSON.stringify(panier));
            showToast(`${produit.nom} ajouté !`);

            const originalText = btn.textContent;
            
            btn.classList.add('is-added');
            btn.textContent = "✓ Ajouté";
            btn.disabled = true;

            setTimeout(() => {
                btn.classList.remove('is-added');
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }
    });

    // Filtres
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            currentFilter = button.dataset.filter;
            currentPage = 1;
            updateDisplay();
        });
    });

    // --- 8. UTILITAIRES ---
    const showToast = (msg) => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = msg;
        container?.appendChild(toast);
        setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 500); }, 2500);
    };

    // --- 9. EFFET D'EAU (VAGUES AU SURVOL) ---
    document.addEventListener('mousemove', (e) => {
        const surface = e.target.closest('.water-surface');
        
        if (surface) {
            const rect = surface.getBoundingClientRect();
            
            const ripple = document.createElement('span');
            ripple.className = 'water-ripple';
            
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            
            const overlay = surface.querySelector('.water-overlay');
            if (overlay) {
                overlay.appendChild(ripple);
                setTimeout(() => ripple.remove(), 1000);
            }
        }
    });

    // --- INITIALISATION FINALE ---
    initLives();
    fetchOpenAgenda();
});