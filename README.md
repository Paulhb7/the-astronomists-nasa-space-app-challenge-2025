# 🌌 The Astronomist

**Agent IA NASA pour la chasse aux exoplanètes**

Une application web complète qui combine des agents IA de pointe avec les données d'exoplanètes de la NASA pour fournir une analyse intelligente et une exploration des systèmes exoplanétaires. The Astronomist dispose d'une interface spatiale époustouflante avec visualisation de données en temps réel et capacités de recherche alimentées par l'IA.

## 🌟 Vue d'ensemble

The Astronomist est une application full-stack qui réunit :

- **Frontend** : Next.js 15 avec TypeScript et Tailwind CSS
- **Backend** : FastAPI avec agents IA spécialisés
- **Sources de données** : Archive d'Exoplanètes NASA, arXiv, et Perplexity AI
- **Visualisation** : Visualiseur de planètes 3D interactif et animations de champ d'étoiles

## 🚀 Fonctionnalités

### 🎨 Expérience utilisateur immersive
- **Champ d'étoiles Hyperspace** : Arrière-plan animé avec effets de distorsion
- **Visualisation de planètes 3D** : Modèles d'exoplanètes interactifs avec rendu réaliste
- **Design responsive** : Optimisé pour ordinateurs de bureau et appareils mobiles
- **Thème spatial** : Interface sombre futuriste avec effets lumineux et animations fluides

### 🤖 Analyse alimentée par l'IA
- **Agent Johannes Kepler** : Analyse complète d'exoplanètes utilisant l'Archive d'Exoplanètes NASA via astroquery, recherche de littérature arXiv, et synthèse astrophysique spécialisée
- **Agent Grace Hopper** : Recherche avancée d'exoplanètes combinant littérature scientifique, intelligence web et résultats de classification d'un modèle de machine learning avec modèles de données structurés et capacités d'analyse complètes
- **Recherche intégrée** : Les deux agents utilisent Perplexity AI pour recherche web et synthèse de pointe

### 📊 Intégration de données
- **Archive d'Exoplanètes NASA** : Accès direct via astroquery aux paramètres officiels d'exoplanètes, caractéristiques orbitales, et propriétés stellaires
- **NASA Eyes** : Intégration des données et visualisations NASA Eyes pour l'exploration planétaire, simulations orbitales et modélisation 3D des systèmes exoplanétaires
- **Littérature scientifique** : Intégration d'articles de recherche arXiv avec extraction automatisée d'abstracts et gestion de citations  
- **Intelligence web** : Prophecy AI pour synthèse de recherche complète avec focus astrophysique spécialisé
- **Modèles de données structurés** : Modèle ExoplanetCharacteristics Pydantic pour gestion robuste des paramètres
- **Upload de fichiers** : Support pour images JWST et analyse de données de transit

### 🔍 Capacités de recherche
- **Recherche d'exoplanètes** : Requêtes à la base de données NASA pour planètes spécifiques
- **Analyse de système** : Comparaison et analyse de systèmes multi-planètes
- **Évaluation d'habitabilité** : Évaluation alimentée par l'IA du potentiel de vie
- **Suivi de missions** : Statut des missions NASA en temps réel et découvertes

## 🏗️ Architecture

### Frontend (`the-astronomist/`)
```
src/app/
├── page.tsx                          # Page d'accueil avec champ d'étoiles
├── exploration-path/                 # Interface de recherche de planètes
├── grace-hopper-report/              # Résultats d'analyse agent Grace Hopper
├── grace-hopper-input/               # Saisie de données d'exoplanètes personnalisées
├── kepler-input/                     # Interface agent Johannes Kepler
├── kepler-results/                   # Résultats d'analyse agent Kepler
├── kepler-system-viewer/             # Visualiseur de systèmes multi-planètes
├── kepler-bibliographic-research/    # Interface de recherche bibliographique
├── mission-dashboard/                # Vue d'ensemble des missions NASA
├── mission-viewer/                   # Visualiseur détaillé des missions
├── components/                       # Composants UI réutilisables
├── services/                         # Services d'intégration API
└── api/                              # Routes API Next.js
```

### Backend (`ai_agents/`)
```
ai_agents/
├── api.py                           # Application FastAPI avec endpoints streaming
├── start_api.py                     # Script de démarrage serveur
├── astronomist_agents/               # Dossier des agents IA spécialisés
│   ├── johannes_kepler_agent.py     # Agent Johannes Kepler avec intégration astroquery
│   └── grace_hopper_agent.py         # Agent Grace Hopper avec modèle ExoplanetCharacteristics
├── classifiers/
│   ├── exoplanet_classifier.py     # Classificateur ML pour exoplanètes
│   └── models/
│       └── exoplanet_grace_hopper.pkl  # Modèle ML sauvegardé
├── requirements.txt                 # Dépendances Python incluant astroquery
└── README.md                        # Documentation détaillée des agents
```

## 🛠️ Stack Technologique

### Frontend
- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Développement type-safe
- **Tailwind CSS** : Styling utilitaire-first
- **React Markdown** : Rendu de texte enrichi

### Backend
- **FastAPI** : Framework web Python moderne avec support streaming
- **OpenAI Agents** : Framework d'agents IA avec appel de fonctions
- **Pydantic** : Validation et sérialisation de données (modèle ExoplanetCharacteristics)
- **Astroquery** : Accès direct à l'Archive d'Exoplanètes NASA
- **Uvicorn** : Serveur ASGI
- **Requests/HTTPX** : Bibliothèques client HTTP pour intégration API

### IA & Données
- **OpenAI GPT-5-mini-2025-08-07** : Modèle de langage avancé pour analyse scientifique
- **Perplexity AI** : Recherche web spécialisée avec focus astrophysique
- **Archive d'Exoplanètes NASA** : Données d'exoplanètes officielles via astroquery
- **API arXiv** : Accès à la littérature scientifique avec extraction automatisée d'abstracts

### 🔬 Classificateur Machine Learning
- **Modèle** : HistGradientBoostingClassifier avec pipeline de preprocesssing avancé
- **Architecture** : Transformer quantile, imputation de valeurs manquantes, feature engineering avec transformations logarithmiques et ratios
- **Performance** : 
  - F1-macro Score: 0.831 ± 0.002
  - Balanced Accuracy: 0.834 ± 0.003
- **Validation** : 5-Fold Stratified Group Cross-Validation avec validation Leave-One-Mission-Out pour robustesse entre missions Kepler/K2/TESS
- **Données d'entraînement** : Archive NASA Exoplanet (KOI + K2 + TOI missions)

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et npm
- Python 3.8+
- Clé API OpenAI
- Clé API Perplexity

### Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd astronomist
   ```

2. **Configurer le backend**
   ```bash
   cd ai_agents
   pip install -r requirements.txt
   
   # Créer le fichier d'environnement
   cp env.example .env
   # Éditer .encode avec vos clés API
   ```

3. **Configurer le frontend**
   ```bash
   cd the-astronomist
   npm install
   ```

### Lancement de l'application

1. **Démarrer l'API des agents IA**
   ```bash
   cd ai_agents
   python start_api.py
   ```
   API disponible à : http://localhost:8000

2. **Démarrer le frontend**
   ```bash
   cd the-astronomist
   npm run dev
   ```
   Application disponible à : http://localhost:3000

## 📱 Pages de l'Application

### 🏠 Page d'Accueil
- Animation de champ d'étoiles Hyperspace
- Visualiseur de planètes interactif
- Accès rapide aux fonctionnalités principales
- Cartes de vue d'ensemble des missions

### 🔍 Recherche d'Exoplanètes
- Recherche dans l'Archive d'Exoplanètes NASA
- Validation de données en temps réel
- Affichage des paramètres de planètes
- Intégration d'analyse directe

### 🧠 Rapport Astronome
- Analyse IA Johannes Kepler avec intégration astroquery
- Consultation directe des paramètres de l'Archive d'Exoplanètes NASA
- Recherche de littérature astrophysique spécialisée via Perplexity AI
- Interface de chat interactive avec transparence d'utilisation des outils
- Visualisation 3D de planètes avec données réelles

### 🚀 Saisie Grace Hopper
- Saisie de données d'exoplanètes personnalisées avec modèle ExoplanetCharacteristics
- Support d'upload de fichiers (images JWST, données de transit)
- Validation et traitement structuré des paramètres
- Synthèse de recherche complète combinant littérature et intelligence web

### 📚 Recherche Bibliographique
- Intégrée dans l'agent Johannes Kepler pour une analyse sans faille
- Recherche de littérature scientifique arXiv avec extraction automatisée d'abstracts
- Identification et synthèse de tendances de recherche
- Études méthodologiques avec focus publié-évalué
- Suivi de publications avec DOIs et ADS bibcodes

### 🛰️ Tableau de Bord des Missions
- Missions NASA actives (TESS, JWST)
- Statut des missions et découvertes
- Données historiques des missions
- Mises à jour en temps réel

### 🌌 Visualiseur de Système
- Visualisation de systèmes multi-planètes
- Affichage de mécaniques orbitales
- Analyse comparative
- Modèles 3D interactifs

## 🔧 Endpoints API

### Agent Johannes Kepler
- `POST /kepler/analyze` - Analyse complète d'exoplanètes utilisant astroquery et recherche de littérature
- `GET /kepler/health` - Contrôle de santé

### Recherche Bibliographique (via Agent Kepler)
- `POST /bibliographic/analyze` - Redirige vers l'agent Kepler pour une analyse intégrée

### Agent Grace Hopper
- `POST /grace-hopper/analyze` - Recherche avancée d'exoplanètes avec modèle ExoplanetCharacteristics
- `POST /grace-hopper/analyze-with-files` - Analyse avec images JWST et données de transit
- `GET /grace-hopper/health` - Contrôle de santé

### Général
- `GET /` - Statut API
- `GET /docs` - Documentation API interactive

## 🎯 Cas d'Utilisation

### Recherche Académique
- **Reviews de Littérature** : Analyse bibliographique complète
- **Exploration de Données** : Recherche dans l'Archive d'Exoplanètes NASA
- **Analyse de Tendances** : Identification de patterns de recherche
- **Études Comparatives** : Analyse de systèmes multi-planètes

### Éducation
- **Apprentissage Interactif** : Science des exoplanètes pratique
- **Projets Étudiants** : Devoirs de recherche avec données réelles
- **Développement Curriculaire** : Contenu d'éducation scientifique
- **Vulgarisation Publique** : Présentations engageantes

### Découverte Scientifique
- **Exploration de Systèmes** : Analyse de nouveaux systèmes d'exoplanètes
- **Évaluation d'Habitabilité** : Évaluation du potentiel de vie
- **Planification Observationnelle** : Sélection de cibles pour missions
- **Développement de Méthodes** : Nouvelles techniques de caractérisation

## 🔍 Fonctionnalités Clés en Détail

### Capacités de l'Agent IA
- **Analyse en Temps Réel** : Streaming en direct des réponses IA avec suivi d'utilisation des outils
- **Intégration Astroquery** : Accès direct à l'Archive d'Exoplanètes NASA via Python
- **Recherche Spécialisée** : Synthèse Perplexity AI focalisée astrophysique
- **Modèles de Données Structurés** : Validation Pydantic ExoplanetCharacteristics
- **Intégration Multi-Sources** : NASA, arXiv, et recherche web complète
- **Traitement de Fichiers** : Support d'analyse d'images JWST et données de transit
- **Gestion d'Erreurs** : Mécanismes robustes de gestion et récupération d'erreurs

### Visualisation de Données
- **Modèles de Planètes 3D** : Rendu réaliste d'exoplanètes
- **Mécaniques Orbitales** : Visualisation de dynamiques de système
- **Tableaux de Paramètres** : Présentation de données structurées
- **Graphiques Interactifs** : Exploration dynamique de données
- **Suivi de Missions** : Statut des missions NASA en temps réel

### Expérience Utilisateur
- **Design Responsif** : Optimisation mobile et desktop
- **Animations Fluides** : Champ d'étoiles 60fps et transitions
- **Navigation Intuitive** : Architecture d'information claire
- **Accessibilité** : Support lecteur d'écran et clavier
- **Performance** : Chargement et rendu optimisés

## 🚨 Résolution de Problèmes

### Problèmes Courants
1. **Connexion API** : S'assurer que le backend fonctionne sur le port 8000
2. **Erreurs CORS** : Vérifier la configuration du serveur API
3. **Upload de Fichiers** : Vérifier les limites de taille et format de fichiers
4. **Performance** : Surveiller les temps de réponse API
5. **Environnement** : Vérifier les clés API dans le fichier `.env` file

### Messages d'Erreur
- `Connection refused` : Backend API pas lancé
- `CORS error` : Problème de communication frontend-backend
- `API key error` : Clés API manquantes ou invalides
- `File upload failed` : Vérifier le format et la taille du fichier

## 📚 Documentation

- **Documentation API** : http://localhost:8000/docs (Interface Swagger UI interactive)
- **README Agent** : `ai_agents/README.md` (Documentation complète des agents)
- **Composants Frontend** : Documentation inline dans les fichiers source
- **Modèles de Données** : Interfaces TypeScript et modèles Pydantic (ExoplanetCharacteristics)
- **Documentation Outils** : Descriptions détaillées de fonctions pour astroquery et outils de recherche

## 🤝 Contribution

1. Fork le repository
2. Créer une branche feature
3. Apporter les modifications
4. Tests approfondis
5. Soumettre une pull request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour les détails.

## 🙏 Remerciements

- **Archive d'Exoplanètes NASA** pour avoir fourni les données d'exoplanètes officielles
- **arXiv** pour l'accès libre aux prépublications scientifiques
- **Perplexity AI** pour les capacités de recherche complètes
- **OpenAI** pour le framework d'agents et le modèle de langage
- **FastAPI** pour le framework web moderne
- **Next.js** pour le framework React
- **Communauté Astronomique** pour la recherche continue et les découvertes

## 📞 Support

Pour les problèmes et questions :
- Consulter la section de résolution de problèmes
- Consulter la documentation API à http://localhost:8000/docs
- Vérifier la configuration de l'environnement
- Tester d'abord avec des requêtes simples

---

**Note** : Cette application est conçue pour la recherche scientifique et les objectifs éducatifs. Toujours vérifier les informations critiques via des sources officielles. Les agents IA fournissent de l'analyse et de la synthèse mais doivent être utilisés comme outils de support, pas pour remplacer le jugement scientifique et l'évaluation par les pairs.

## 🌟 Premier Pas

1. **Explorer le Cosmos** : Commencer par la page d'accueil pour découvrir le champ d'étoiles
2. **Rechercher des Exoplanètes** : Utiliser la fonction de recherche pour trouver des planètes spécifiques
3. **Analyse IA** : Laisser l'agent Johannes Kepler analyser vos découvertes
4. **Recherche Personnalisée** : Utiliser Grace Hopper pour l'analyse d'exoplanètes personnalisées
5. **Review de Littérature** : Explorer les papiers scientifiques avec l'agent bibliographique
6. **Suivi de Missions** : Surveiller les missions NASA et découvertes

Bienvenue dans The Astronomist - où l'IA rencontre le cosmos ! 🚀✨
