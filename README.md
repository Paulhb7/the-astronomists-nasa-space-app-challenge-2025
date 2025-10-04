# 🧠 The Astronomists

> *"The most dangerous phrase in the language is: 'We've always done it this way.'"* - Grace Hopper, PhD

A full-stack web application that unites machine learning, agentic reasoning, and immersive visualization for exoplanet discovery and analysis. Built for the NASA Space Apps Challenge, this project honors Grace Hopper's legacy of curiosity, courage, and the drive to go beyond what has always been done.

## 🎥 Live Demo

You can watch the full walkthrough on YouTube:

[![Watch Live Demo](https://img.youtube.com/vi/imL7TtxZxIg/0.jpg)](https://www.youtube.com/watch?v=imL7TtxZxIg)

*(Click the image to open the live demo video on YouTube)*

## 📸 Website Preview

| Page Name | Preview | Description |
|-----------|---------|-------------|
| **Home Page** | ![Home Page](./public/home.png) | Immersive space-themed interface with starfield animation |
| **Exploration Path** | ![Exploration Path](./public/path.png) | Central hub for selecting AI agents (Kepler, Grace Hopper, Mission Dashboard) |
| **Grace Hopper Input** | ![Grace Hopper Input](./public/hopper_1.png) | Interactive analysis interface for candidate exoplanets with ML predictions |
| **Grace Hopper Light Curves** | ![Grace Hopper Light Curves](./public/hopper_light_curves.png) | Transit data analysis with AstronetCNN deep learning model |
| **Grace Hopper Report** | ![Grace Hopper Report](./public/hopper_repport.png) | AI-powered synthesis and contextualized exoplanet analysis |
| **Kepler Input** | ![Kepler Input](./public/kepler_1.png) | Search interface for confirmed exoplanets with intelligent search engine |
| **Kepler Planet Results** | ![Kepler Planet Results](./public/kepler_2.png) | Exoplanet analysis dashboard with NASA Eyes visualizations |
| **Kepler Planet Results (View 2)** | ![Kepler Planet Results View 2](./public/kepler_2-bis.png) | Alternative view of exoplanet analysis dashboard |
| **Kepler System Viewer** | ![Kepler System Viewer](./public/kepler_3-bis.png) | Stellar system viewer with dual NASA Eyes perspectives |
| **Kepler Bibliographic Research** | ![Kepler Bibliographic Research](./public/kepler_biblio-bis.png) | AI agent for scientific literature analysis via arXiv and publications |
| **Kepler Bibliographic Research (View 2)** | ![Kepler Bibliographic Research View 2](./public/kepler_biblio-bis2.png) | Alternative view of bibliographic research interface |
| **Kepler Agent Report** | ![Kepler Agent Report](./public/kepler_4.png) | Automated scientific report and interactive chat from Johannes Kepler AI agent |
| **Kepler Agent Report (View 2)** | ![Kepler Agent Report View 2](./public/kepler_4_bis.png) | Alternative view of Kepler agent report interface |
| **Mission Dashboard** | ![Mission Dashboard](./public/mission_dashboard.png) | Mission control center for NASA's space observatories |
| **Mission JWST** | ![Mission JWST](./public/mission_jwst.png) | James Webb Space Telescope mission visualization |


## 🌟 Features

The Astronomists delivers an immersive interface designed to highlight both the scientific rigor of the ML pipeline and the accessibility of a modern user experience.

### 🏠 Home Page
An immersive interface with a futuristic space-inspired design and starfield animation. This opening screen places the user directly "in space," setting the tone for exploration and discovery.

### 🛸 Exploration Path
The central hub for selecting AI agents to investigate exoplanets. It offers three paths of analysis:

1. **Johannes Kepler** - for confirmed exoplanets
2. **Grace Hopper** - for advanced analysis of new candidates  
3. **Mission Dashboard** - for monitoring NASA missions on exoplanets

## 🔭 Exploration Paths

### 1st Path - New Exoplanets Data

#### Grace Hopper Agent - Data Page
An interactive analysis interface for candidate exoplanets. Users can manually enter orbital and stellar parameters, run ML-powered predictions, or dive deeper with integrated Jupyter notebooks preloaded for training and data exploration.

**Two modes of input:**
- **Tabular data input** – Users provide orbital and stellar parameters manually (or load an example dataset). The data is sent to a backend ML model exposed through an API, returning predictions (possible candidate, candidate, or false positive).
- **Transit data input** – Users upload light-curve data for analysis by AstronetCNN, a deep learning model trained on KOI data. The system automatically returns classification results.

The page includes an integrated notebook viewer, allowing users to load the model's predictions, inspect the workflow, and run custom analyses within an interactive environment.

#### Grace Hopper Agent Report
The Grace Hopper agent receives raw input (tabular or transit data) and synthesizes this information with its knowledge and the ML model's predictions to provide an informed, contextualized opinion on whether the signal represents an exoplanet.

### 2nd Path - Analyzing Existing Exoplanets Data

#### Kepler Input
A dedicated search interface for confirmed exoplanets, providing quick access to famous planets such as Kepler-22b, TRAPPIST-1e, and Gliese 581g. Features an intelligent search engine alongside shortcut buttons for well-known discoveries.

#### Kepler Planet Results
An exoplanet analysis dashboard that combines NASA Eyes visualizations with detailed scientific data. The screen is split: an interactive 3D visualization on the left, and an orbital and stellar characteristics panel on the right, with navigation links toward system-level analysis.

#### Kepler System Viewer
A stellar system viewer designed with dual NASA Eyes for both a global system view and a focused star-centric perspective. The immersive interface lets users examine the complete system while zooming into stellar magnifications, with action buttons to connect directly to the Kepler agent and the bibliographic search module.

#### Kepler Bibliographic Research
A bibliographic AI agent dedicated to analyzing the scientific literature through databases such as arXiv and peer-reviewed astronomical publications. This specialized interface searches for methodologies, highlights recent discoveries, and generates intelligent syntheses of knowledge related to the specific exoplanet and its solar system.

#### Kepler Agent Report
The intelligence center for the Johannes Kepler AI agent, delivering an automated scientific report and an interactive chat. This sophisticated interface generates detailed analyses powered by AI, integrates NASA Eyes data, and supports real-time dialogue for in-depth scientific exploration.

### 3rd Path - Discovering NASA's Exoplanets Missions

#### Mission Dashboard
A mission control center for NASA's space observatories, featuring a complete catalog of both active and retired missions. The dashboard showcases missions such as TESS, JWST, Kepler, Spitzer, and Hubble, with detailed cards describing their orbits, instruments, and key discoveries.

#### Mission Viewer
An integrated NASA Eyes immersive viewer for real-time exploration of NASA missions. This full-screen interface displays spacecraft and telescopes in action, offering interactive controls, mission data overlays, and smooth navigation for a complete tour of the instruments shaping our view of the universe.

## 🏗️ Project Architecture

The Astronomist is a full-stack web application developed for the NASA Space Apps Challenge, addressing the task of automatic exoplanet identification using artificial intelligence and machine learning.

### Backend
Built with **FastAPI**, a modern Python web framework enabling efficient integration with specialized AI agents. The backend handles user requests, authentication, and the core exoplanet data analysis pipeline, orchestrated through two agents: Johannes Kepler and Grace Hopper.

### Frontend
Developed as a responsive web application using **Next.js 15**, **TypeScript**, and **Tailwind CSS**, optimized for desktop, tablet, and mobile devices. The interface features a futuristic spatial theme with hyperspace starfield animations and interactive 3D exoplanet visualizations, directly using NASA Eyes embedded on the pages.

### Data Integration
Connected to the **NASA Exoplanet Archive** via astroquery to retrieve and process satellite datasets from the Kepler, K2, and TESS missions. The system also integrates **arXiv** for scientific literature and **Perplexity AI** for intelligent synthesis of web-based knowledge.

### Machine Learning Models
- **HistGradientBoostingClassifier** with an advanced preprocessing pipeline, trained on NASA's open datasets. The model achieves an F1 score of **83.1%** in three-class classification (confirmed exoplanets, planetary candidates, false positives), validated through cross-mission testing.
- **AstronetCNN** deep learning algorithm trained on KOI data, used to classify light curves, achieving an F1-score of **65%**.

### Specialized AI Agents
Two distinct agents powered by the **OpenAI Agents framework**:
- **Johannes Kepler** - for in-depth analysis of NASA data and bibliographic research
- **Grace Hopper** - for advanced exploration combining literature review, web intelligence, and support for JWST image uploads and transit data

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/astronomist.git
   cd astronomist
   ```

2. **Backend Setup**
   ```bash
   cd ai_agents
   pip install -r requirements.txt
   cp env.example .env
   # Configure your environment variables
   python start_api.py
   ```

3. **Frontend Setup**
   ```bash
   cd the-astronomist
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📊 Performance Metrics

- **HistGradientBoostingClassifier**: F1-score of 83.1%
- **AstronetCNN**: F1-score of 65%
- Cross-mission validation completed
- Real-time analysis capabilities

## 🔮 Next Steps

This project represents a first draft, designed to make the discovery and study of exoplanets more accessible. The next phase involves:

- **Collaborating with exoplanet scientists** to curate a comprehensive set of high-quality scientific resources
- **Fine-tuning or distilling open-source models** (e.g., using a LoRA approach) to improve accuracy and reliability
- **Exploring integration of Granite 4 from IBM** as a foundation model to enhance the precision and contextual reasoning of our agents
- **Integrating multiple ML models** into the application, allowing users to select which model to apply when making predictions
- **Supporting benchmarking and reproducibility** while fostering collaborative experimentation

*Next: James Webb integration (if we're lucky to win! 😄)*

## 🤝 Contributing

We welcome contributions from the scientific community! Please feel free to:
- Report bugs and issues
- Suggest new features
- Contribute to the ML models
- Improve the documentation

## 📄 License

This project is developed for the NASA Space Apps Challenge and is open source.

## 🙏 Acknowledgments

- **NASA** for providing the datasets and APIs
- **Grace Hopper** for inspiring us to push beyond conventional boundaries
- **The exoplanet research community** for their invaluable contributions to our understanding of the universe

---

*Built with ❤️ for the NASA Space Apps Challenge*
