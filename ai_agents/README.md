# 🤖 Astronomist AI Agents

**Agents intelligents spécialisés pour la recherche d'exoplanètes**

Une suite complète d'agents IA spécialisés pour la recherche et l'analyse d'exoplanètes, combinant les données officielles de la NASA avec la littérature scientifique de pointe. Ce système propose trois agents IA distincts accessibles via une interface FastAPI performante.

## 🌟 Fonctionnalités

### 🔍 Agents spécialisés
- **Johannes Kepler** : Analyse approfondie d'exoplanètes avec données NASA et recherche bibliographique
- **Grace Hopper** : Recherche avancée combinant littérature scientifique et intelligence web
- **Recherche bibliographique** : Analyse intégrée de la littérature scientifique via l'agent Kepler

### 📊 Sources de données
- **Archive d'Exoplanètes NASA** : Accès direct via astroquery aux paramètres officiels
- **arXiv** : Recherche automatisée dans les prépublications scientifiques
- **Perplexity AI** : Synthèse web intelligente avec focus astrophysique

### 🚀 Interface API
- **FastAPI moderne** : API RESTful avec streaming en temps réel
- **Upload de fichiers** : Support pour les images JWST et données de transit
- **Rapports structurés** : Analyses avec citations, paramètres et références
- **Monitoring** : Endpoints de santé et métriques d'utilisation

## 🚀 Installation et Configuration

### Prérequis
- Python 3.8 ou supérieur
- Clé API OpenAI
- Clé API Perplexity

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd ai_agents
```

2. **Installer les dépendances**
```bash
python -m pip install -r requirements.txt
```

3. **Configuration des variables d'environnement**
Créer un fichier `.env` :
```env
OPENAI_API_KEY=votre_clé_openai_api
PERPLEXITY_API_KEY=votre_clé_perplexity_api
```

### Lancement

#### Démarrage du serveur API
```bash
python start_api.py
```

**Endpoints disponibles** :
- **API Base** : http://localhost:8000
- **Documentation** : http://localhost:8000/docs
- **Santé Kepler** : http://localhost:8000/kepler/health
- **Santé Grace Hopper** : http://localhost:8000/grace-hopper/health

#### Utilisation directe des agents
```bash
# Agent Johannes Kepler
python astronomist_agents/johannes_kepler_agent.py Kepler-22b

# Agent Johannes Kepler avec requête personnalisée
python astronomist_agents/johannes_kepler_agent.py "TRAPPIST-1 e" "Comparer avec les autres planètes TRAPPIST-1"

# Agent Grace Hopper (mode test)
python astronomist_agents/grace_hopper_agent.py
```

## 🎯 Agents IA

### 1. Agent Johannes Kepler
**Spécialisation** : Recherche et analyse d'exoplanètes avec données NASA

#### 🛠️ Outils disponibles
- **`astroquery_exoplanet_lookup`** : Requêtes directes à l'Archive d'Exoplanètes NASA
- **`open_science_database_research`** : Recherche bibliographique arXiv
- **`sonar_intelligence_research`** : Recherche astrophysique spécialisée Perplexity AI

#### 📋 Capacités
- Analyse de planètes individuelles avec paramètres complets
- Comparaison de systèmes planétaires multi-planètes
- Recherche de découvertes et tendances récentes
- Accès aux données stellaires et orbitales officielles

### 2. Agent Grace Hopper
**Spécialisation** : Recherche et analyse avancées d'exoplanètes

#### 🛠️ Outils disponibles
- **`open_science_database_research`** : Recherche de littérature scientifique arXiv
- **`sonar_intelligence_research`** : Recherche web complète Perplexity AI
- **`ExoplanetCharacteristics`** : Modèle de données structuré Pydantic

#### 📋 Capacités
- Analyse d'exoplanètes avec paramètres personnalisés
- Évaluation d'habitabilité théorique
- Synthèse de découvertes récentes et découvertes
- Recherche éducative et de vulgarisation

### 3. Recherche Bibliographique (via Agent Kepler)
**Spécialisation** : Analyse et recherche bibliographique scientifique

#### 🛠️ Outils disponibles
- **`comprehensive_literature_search`** : Recherche arXiv multi-stratégies
- **`ai_literature_analysis`** : Synthèse IA de la littérature

#### 📋 Capacités
- Reviews de littérature complètes
- Analyse de tendances de recherche
- Études méthodologiques avec focus publié-évalué
- Suivi de publications avec DOIs et ADS bibcodes

## 🌐 Endpoints API

### Agent Johannes Kepler
- **`POST /kepler/analyze`** - Analyse d'exoplanète avec données NASA et littérature
- **`GET /kepler/health`** - Contrôle de santé

### Recherche Bibliographique
- **`POST /bibliographic/analyze`** - Recherche bibliographique via agent Kepler

### Agent Grace Hopper
- **`POST /grace-hopper/analyze`** - Analyse de caractéristiques d'exoplanète personnalisées
- **`POST /grace-hopper/analyze-with-files`** - Analyse avec images JWST et données de transit
- **`GET /grace-hopper/health`** - Contrôle de santé

### Général
- **`GET /`** - Statut et informations API
- **`GET /docs`** - Documentation interactive (Swagger UI)

## 📊 Exemples d'utilisation

### Agent Johannes Kepler
- **Analyse de planète** : "Fournies-moi une fiche synthétique pour l'exoplanète Kepler-452b (paramètres clés, étoile hôte, découvertes & références)"
- **Comparaison de système** : "Synthétisez les paramètres des planètes TRAPPIST-1, comparez les orbites et résumez 5 articles récents pertinents"
- **Review littéraire** : "Cherchez des articles récents sur WASP-39b et résumez les découvertes clés (JWST, spectroscopie)"
- **Recherche de découvertes** : "Comparez les exoplanètes du système TOI-700"

### Recherche Bibliographique
- **Review de littérature** : "Composition atmosphérique d'exoplanètes"
- **Tendances de recherche** : "Observations JWST d'exoplanètes 2024"

### Agent Grace Hopper
- **Analyse personnalisée** : Analyse de caractéristiques d'exoplanète fournies par l'utilisateur
- **Évaluation d'habitabilité** : Évaluation théorique du potentiel de vie
- **Recherche de système stellaires** : Analyse de l'étoile hôte et du système

## 🌐 API Endpoints

### Johannes Kepler Agent
- **POST** `/kepler/analyze` - Analyze exoplanet using NASA data and literature
- **GET** `/kepler/health` - Health check for Kepler agent

### Bibliographic Research (via Kepler Agent)
- **POST** `/bibliographic/analyze` - Conduct bibliographic research using Kepler agent

### Grace Hopper Agent
- **POST** `/grace-hopper/analyze` - Analyze custom exoplanet characteristics
- **POST** `/grace-hopper/analyze-with-files` - Analyze with JWST images and transit data
- **GET** `/grace-hopper/health` - Health check for Grace Hopper agent

### General
- **GET** `/` - API status and information
- **GET** `/docs` - Interactive API documentation (Swagger UI)

## 📊 Example Queries

### Johannes Kepler Agent
- **Planet Analysis**: "Give me a synthetic sheet for exoplanet Kepler-452b (key parameters, host star, discoveries & references)"
- **System Comparison**: "Synthesize the parameters of TRAPPIST-1 planets, compare orbits and summarize 5 recent relevant papers"
- **Literature Review**: "Search for recent articles on WASP-39b and summarize key findings (JWST, spectroscopy)"
- **Discovery Research**: "Compare exoplanets in the TOI-700 system"

### Bibliographic Research Agent
- **Literature Review**: "exoplanet atmospheric composition"
- **Research Trends**: "JWST exoplanet observations 2024"
- **Methodological Studies**: "transit spectroscopy techniques"

### Grace Hopper Agent
- **Custom Analysis**: Analysis of user-provided exoplanet characteristics
- **Habitability Assessment**: Theoretical habitability evaluation
- **Stellar System Research**: Host star and system analysis

## 🏗️ Architecture

### Agent Framework
- Built on OpenAI Agents framework
- Uses GPT-5-mini-2025-08-07 model
- Implements function calling for tool integration
- Supports streaming responses via FastAPI

### API Architecture
- **FastAPI**: Modern, fast web framework for building APIs
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **File Upload**: Support for JWST images and transit data
- **Real-time Streaming**: Live response streaming with tool usage visibility
- **Health Checks**: Endpoint monitoring and status reporting

### Data Sources
- **NASA Exoplanet Archive**: Authoritative exoplanet database via TAP service
- **arXiv**: Preprint repository for astrophysics (astro-ph category)
- **Perplexity AI**: Real-time web research and synthesis
- **Custom Data**: User-provided exoplanet characteristics

### Response Format
- Structured analysis with clear sections
- Parameter tables and bullet points
- Direct links to NASA archive pages
- Citations with key takeaways
- Tool usage transparency
- JSON API responses with success/error handling

## 🔍 Research Workflow

### Johannes Kepler Agent
1. **Input Processing**: User query analysis and intent recognition
2. **Astroquery Lookup**: Direct NASA Exoplanet Archive access via astroquery
3. **Literature Search**: arXiv research for recent publications
4. **Astrophysics Research**: Specialized Perplexity AI literature synthesis
5. **Response Generation**: Structured report with parameter tables and citations

### Bibliographic Research (via Kepler Agent)
1. **Query Analysis**: Research topic identification and scope definition
2. **Multi-Strategy Search**: Comprehensive arXiv search with multiple strategies
3. **Literature Analysis**: AI-powered synthesis of findings and trends
4. **Report Generation**: Structured bibliographic analysis integrated with exoplanet data

### Grace Hopper Agent
1. **Characteristics Processing**: Analysis of ExoplanetCharacteristics data model
2. **Literature Research**: arXiv search for relevant scientific publications
3. **Web Intelligence**: Comprehensive Perplexity AI research synthesis
4. **Habitability Assessment**: Scientific evaluation of potential for life
5. **Comprehensive Report**: Structured analysis with recent discoveries and context

## 📝 Output Format

### Johannes Kepler Agent
- *Italic summary* of the research approach
- **Bold section headers** for organization
- Compact parameter tables with units
- NASA archive links for verification
- 3-6 recent papers with key takeaways
- Tool usage indicators during processing

### Bibliographic Research Agent
- Executive summary of findings
- Key research trends and patterns
- Methodological notes and innovations
- Research gaps and future directions
- Practical implications and applications
- Structured article listings with metadata

### Grace Hopper Agent
- Executive summary of research findings
- Scientific literature synthesis with citations
- Web research integration and recent discoveries
- Habitability assessment and parameter analysis
- Comparative analysis with known exoplanets
- Future research prospects and observational recommendations

## 🛠️ Technical Details

### Dependencies
- `openai-agents`: Core agent framework
- `fastapi`: Web framework for building APIs
- `uvicorn`: ASGI server for FastAPI
- `requests`: HTTP client for API calls
- `httpx`: Async HTTP client for API calls
- `python-dotenv`: Environment variable management
- `pydantic`: Data validation and modeling
- `orjson`: High-performance JSON parsing
- `astroquery`: Astronomical data access (NASA Exoplanet Archive)
- `xml.etree.ElementTree`: XML parsing for arXiv API responses

### External API Endpoints
- NASA Exoplanet Archive (via astroquery): Direct Python interface to exoplanet data
- arXiv API: `http://export.arxiv.org/api/query`
- Perplexity AI: `https://api.perplexity.ai/chat/completions`

### File Structure
```
ai_agents/
├── api.py                    # FastAPI application and endpoints
├── start_api.py             # API server startup script
├── astronomist_agents/      # Specialized AI agents folder
│   ├── johannes_kepler_agent.py  # Johannes Kepler agent with astroquery integration
│   └── grace_hopper_agent.py      # Grace Hopper agent with ExoplanetCharacteristics model
├── classifiers/             # ML classification components
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This documentation
```

## 🚨 Troubleshooting

### Common Issues

1. **jiter Import Error**:
   ```bash
   py -m pip install orjson
   ```

2. **API Key Errors**:
   - Verify `.env` file exists
   - Check API key validity
   - Ensure proper environment variable names

3. **Network Issues**:
   - Check internet connectivity
   - Verify API endpoint accessibility
   - Review firewall settings

4. **API Server Issues**:
   - Ensure port 8000 is available
   - Check if API is running: `http://localhost:8000/kepler/health`
   - Verify all dependencies are installed

5. **File Upload Issues**:
   - Check file size limits
   - Verify supported file formats (images, text files)
   - Ensure proper multipart form data encoding

### Error Messages
- `OPENAI_API_KEY is not set`: Add OpenAI API key to `.env`
- `PERPLEXITY_API_KEY n'est pas défini`: Add Perplexity API key to `.env`
- `cannot import name 'from_json' from 'jiter'`: Install orjson dependency
- `Connection refused`: API server not running or wrong port
- `CORS error`: Frontend not properly configured for API access

## 📚 Use Cases

### Academic Research
- **Literature Reviews**: Comprehensive bibliographic analysis integrated with exoplanet research via Kepler agent
- **Data Analysis**: NASA Exoplanet Archive data exploration and synthesis
- **Trend Analysis**: Identification of research patterns and future directions
- **Comparative Studies**: Multi-planet system analysis and characterization

### Education
- **Teaching**: Interactive exoplanet science education with real data
- **Student Projects**: Research assignments using authoritative sources
- **Curriculum Development**: Science education content creation
- **Public Outreach**: Engaging presentations with current research

### Scientific Discovery
- **System Exploration**: Discovery and analysis of new exoplanet systems
- **Habitability Assessment**: Theoretical evaluation of life potential
- **Observational Planning**: Target selection for future observations
- **Method Development**: New techniques for exoplanet characterization

### Professional Applications
- **Mission Planning**: Target selection for space missions
- **Instrument Development**: Requirements analysis for new telescopes
- **Policy Support**: Scientific input for space exploration decisions
- **Industry Research**: Commercial space and astronomy applications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **NASA Exoplanet Archive** for providing authoritative exoplanet data via TAP service
- **arXiv** for open access to scientific preprints and research papers
- **Perplexity AI** for comprehensive web research and synthesis capabilities
- **OpenAI** for the agent framework and language model technology
- **FastAPI** for the modern, high-performance web framework
- **Astronomical Community** for ongoing research and discoveries in exoplanet science