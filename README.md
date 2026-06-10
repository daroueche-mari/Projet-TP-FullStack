#  Villa Nova - Billetterie Culturelle Spécialisée

Bienvenue sur le dépôt de **Villa Nova**, une plateforme de billetterie en ligne moderne, fluide et optimisée, spécialisée dans la réservation de places pour des événements culturels (spectacles, concerts, patrimoine, arts visuels, lettres).

Le site est entièrement conçu en approche *Mobile-First*, offrant une expérience utilisateur (UX) immersive inspirée des mouvements de l'eau.

---

##  Fonctionnalités Clés et Améliorations

### 1. Connexion Directe à l'API OpenAgenda (v2)
* **Zéro Proxy (Sans CORS Anywhere)** : Connexion directe et sécurisée aux serveurs officiels d'OpenAgenda, éliminant les bugs de serveurs intermédiaires et les ralentissements.
* **Fallback & URLs Robustes** : Système de sécurité intelligent qui détecte les données d'OpenAgenda et reconstruit automatiquement les URLs d'événements manquantes.
* **Redirection Externe** : Un clic sur une carte d'événement ouvre proprement la page de description complète officielle sur OpenAgenda dans un nouvel onglet, préservant la session d'achat de l'utilisateur sur Villa Nova.
* **Tri par Mots-Clés** : Analyse sémantique des titres et descriptions reçus pour classer automatiquement les événements dans les filtres appropriés (*Spectacle, Patrimoine, Visuels, Lettres*).

### 2. Expérience Utilisateur & Design Immersif
* **Effet Aquatique Dynamique** : Micro-interactions simulant des ondes et vagues d'eau (`water-ripple`) au survol de la souris sur les zones clés du site.
* **Streaming en Direct (Section Lives)** : Module interactif local permettant de visionner ou de fermer des sessions acoustiques et des visites d'ateliers en direct, avec intégration vidéo fluide et gestion d'état des boutons (`is-actived`).
* **Pagination Fluide** : Pagination JavaScript dynamique couplée à un défilement automatique (`scrollIntoView`) pour un confort de navigation optimal.

### 3. Cycle d'Achat Complet (Local Storage)
* **Panier Autonome** : Ajout de billets en un clic avec retour visuel immédiat (bouton temporaire "✓ Ajouté"). Gestion dynamique des quantités, incrémentation automatique et calcul des totaux en temps réel (`localStorage`).
* **Tunnel de Paiement Sécurisé** : Formulaire de paiement complet avec masque de saisie intelligent pour la date d'expiration (`MM/AA`), validation stricte des champs obligatoires et vidage automatique du panier après confirmation.

### 4. Architecture CSS Moderne (SASS / SCSS)
* **Structure Modulaire** : Architecture propre divisée en composants isolés (`_header.scss`, `_events.scss`, `_panier.scss`, `_contact.scss`, `_payment.scss`, `_footer.scss`) centralisés par un fichier `main.scss`.
* **Design Système Unifié** : Utilisation stricte de variables globales pour gérer un thème chromatique cohérent, des arrondis harmonisés (`$radius-main`) et des espacements proportionnels.
* **Accessibilité (A11y)** : Intégration de contours ultra-visibles via la pseudo-classe `:focus-visible` pour garantir une navigation au clavier fluide et accessible.

---

##  Technologies Utilisées

* **HTML5** : Structure sémantique, utilisation de balises `<template>` pour l'injection dynamique.
* **SASS / SCSS** : Préprocesseur CSS, variables complexes, mixins responsives, architecture modulaire et animations `@keyframes`.
* **JavaScript (ES6+)** : Manipulation du DOM, requêtes asynchrones (`Fetch / Async Await`), persistance des données (`Local Storage`).
* **API Externe** : REST API d'OpenAgenda v2.

---

##  Installation et Lancement Local

L'API OpenAgenda interrogeant directement un serveur distant, les politiques de sécurité des navigateurs bloquent les requêtes si le fichier HTML est ouvert directement (adresse en `file:///`). **Il est obligatoire d'utiliser un serveur local.**

1. Clonez ce dépôt sur votre machine :
   ```bash
   git clone [https://github.com/votre-username/villa-nova.git](https://github.com/votre-username/villa-nova.git)
