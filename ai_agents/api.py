from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any, Literal
from astronomist_agents.johannes_kepler_agent import create_agent, Runner
from astronomist_agents.grace_hopper_agent import analyze_exoplanet_with_grace_hopper, ExoplanetCharacteristics
import json
import os
import logging
import numpy as np
import pandas as pd
from classifiers.exoplanet_classifier import load_model, _feature_engineering, LABEL_MAP, INV_LABEL_MAP

# ---------------- Config ----------------
MODEL_PATH = "models\exoplanet_grace_hopper.pkl"
APP_TITLE = "Astronomist AI Agents & ML API"
APP_VERSION = "1.0.0"

logger = logging.getLogger("uvicorn.error")

# ---------------- Schémas ML ----------------
MissionLiteral = Literal["KEPLER", "K2", "TESS"]

class ExoplanetInput(BaseModel):
    mission: Optional[MissionLiteral] = Field(None, description="Mission d'origine (KEPLER/K2/TESS)")
    period: Optional[float] = Field(None, description="Période orbitale (jours)")
    duration: Optional[float] = Field(None, description="Durée de transit (heures)")
    depth: Optional[float] = Field(None, description="Profondeur de transit (ppm)")

    # Champs optionnels utilisables si fournis
    snr: Optional[float] = None
    st_teff: Optional[float] = None
    st_logg: Optional[float] = None
    st_rad: Optional[float] = None
    mag: Optional[float] = None
    fpflag_nt: Optional[float] = None
    fpflag_ss: Optional[float] = None
    fpflag_co: Optional[float] = None
    fpflag_ec: Optional[float] = None

    @validator("duration")
    def _validate_duration_hours(cls, v):
        if v is None:
            return v
        if v < 0:
            raise ValueError("`duration` doit être >= 0 (heures).")
        if 0 < v < 0.05:  # ~ <3 minutes
            raise ValueError("`duration` attend des heures (si minutes, divise par 60).")
        return v

    @validator("depth")
    def _validate_depth_ppm(cls, v):
        if v is None:
            return v
        if v <= 0:
            raise ValueError("`depth` doit être > 0 (ppm).")
        if v < 1:
            raise ValueError("`depth` attend des ppm (pas une fraction/%).")
        return v

class PredictResponse(BaseModel):
    pred_label: str
    p_FALSE_POSITIVE: float
    p_CANDIDATE: float
    p_CONFIRMED: float

class BatchPredictResponse(BaseModel):
    results: List[PredictResponse]

# ---------------- Schémas Agents ----------------

class ExoplanetQuery(BaseModel):
    planet_name: str
    query: Optional[str] = None

class AgentResponse(BaseModel):
    success: bool
    result: Optional[str] = None
    error: Optional[str] = None
    tools_used: Optional[list] = None

class GraceHopperRequest(BaseModel):
    characteristics: Dict[str, Any]
    query: Optional[str] = None

class GraceHopperResponse(BaseModel):
    success: bool
    result: Optional[str] = None
    error: Optional[str] = None
    tools_used: Optional[List[str]] = None

app = FastAPI(title=APP_TITLE, version=APP_VERSION)

# Autoriser le front Next.js à accéder à l'API (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variables globales pour le modèle ML
_model = None
_all_num_cols: List[str] = []
_cat_cols: List[str] = []
_label_map = {}

@app.on_event("startup")
def _load_model_on_startup():
    global _model, _all_num_cols, _cat_cols, _label_map
    try:
        _model, _all_num_cols, _cat_cols, _label_map = load_model(MODEL_PATH)
        logger.info("Model loaded from %s", MODEL_PATH)
    except Exception as e:
        logger.exception("Could not load model: %s", e)
        raise

# ---------------- Utils ML ----------------
RESPONSE_COLUMNS = [
    "pred_label",
    "p_FALSE_POSITIVE",
    "p_CANDIDATE",
    "p_CONFIRMED",
]

def predict_from_df(model, all_num_cols, cat_cols, df_new: pd.DataFrame) -> pd.DataFrame:
    """
    Transforme un DataFrame de nouvelles exoplanètes et renvoie les prédictions
    + probabilités dans un DataFrame enrichi.

    Colonnes de sortie :
    - pred_label
    - p_FALSE_POSITIVE
    - p_CANDIDATE
    - p_CONFIRMED
    """
    # 1) Feature engineering de base
    dfX = _feature_engineering(df_new.copy())

    # 2) Colonnes attendues = celles vues à l'entraînement
    expected = list(getattr(model, "feature_names_in_", [])) or list(all_num_cols) + list(cat_cols)

    # 3) Encodage mission si le modèle attend des dummies mission_*
    if "mission" in dfX.columns and any(c.startswith("mission_") for c in expected):
        m = dfX.pop("mission").astype(str).str.upper().fillna("UNKNOWN")
        dummies = pd.get_dummies(m, prefix="mission")
        dfX = pd.concat([dfX, dummies], axis=1)

    # 4) Ajouter colonnes manquantes avec 0
    for c in expected:
        if c not in dfX.columns:
            dfX[c] = 0

    # 5) Conserver l'ordre attendu
    X = dfX[expected]

    # 6) Nettoyer NaN / inf
    X = X.replace([np.inf, -np.inf], np.nan).fillna(0)

    # 7) Inférence
    proba = model.predict_proba(X)
    y = model.predict(X)  # garder tel quel, peut être int ou str

    # Helper pour normaliser les noms de classes
    def norm(x: str) -> str:
        return str(x).upper().replace("_", " ").strip()

    # Classes vues par le modèle
    classes = list(getattr(model, "classes_", []))
    cls_to_idx = {norm(c): i for i, c in enumerate(classes)} if classes else {}

    # 8) Construire la colonne pred_label
    y_labels = []
    for yi in y:
        if isinstance(yi, str):
            y_labels.append(norm(yi))
        else:
            # yi est un entier → mapper si possible
            if 'INV_LABEL_MAP' in globals() and yi in INV_LABEL_MAP:
                y_labels.append(norm(INV_LABEL_MAP[yi]))
            else:
                y_labels.append(str(yi))

    out = df_new.copy()
    out["pred_label"] = y_labels

    # 9) Colonnes de probas demandées
    wanted = ["FALSE POSITIVE", "CANDIDATE", "CONFIRMED"]

    # fallback : utiliser LABEL_MAP si pas de classes_
    if not cls_to_idx and 'LABEL_MAP' in globals():
        cls_to_idx = {norm(k): v for k, v in LABEL_MAP.items()}

    for w in wanted:
        col = f"p_{w.replace(' ', '_')}"
        if w in cls_to_idx:
            out[col] = proba[:, cls_to_idx[w]]
        else:
            out[col] = 0.0

    return out

def _predict_df(df: pd.DataFrame) -> pd.DataFrame:
    if _model is None:
        raise RuntimeError("Model not loaded")
    return predict_from_df(_model, _all_num_cols, _cat_cols, df)

@app.get("/")
async def root():
    return {"message": "Astronomist AI Agents & ML API", "status": "active"}

@app.post("/kepler/analyze", response_model=AgentResponse)
async def analyze_exoplanet(request: ExoplanetQuery):
    """
    Analyze an exoplanet using the Johannes Kepler AI agent
    """
    try:
        planet_name = request.planet_name
        custom_query = request.query or f"Give me a synthetic sheet for exoplanet {planet_name} (key parameters, host star, discoveries & references)."
        
        # Create the agent
        agent = create_agent()
        chat_history = []
        
        # Add the query to history
        chat_history.append({"role": "user", "content": custom_query})
        
        # Run the agent
        result = Runner.run_streamed(agent, chat_history)
        response_content = ""
        tools_used = []
        
        async for event in result.stream_events():
            if event.type == "raw_response_event":
                data_type = getattr(event.data, "type", None)
                if hasattr(event.data, "delta"):
                    if data_type == "response.output_text.delta":
                        response_content += event.data.delta
                        
            elif event.type == "run_item_stream_event":
                item = event.item
                if item.type == "tool_call_item":
                    tool_name = getattr(item.raw_item, "name", "Tool")
                    if tool_name not in tools_used:
                        tools_used.append(tool_name)
        
        return AgentResponse(
            success=True,
            result=response_content,
            tools_used=tools_used
        )
        
    except Exception as e:
        return AgentResponse(
            success=False,
            error=str(e)
        )

@app.post("/bibliographic/analyze", response_model=AgentResponse)
async def analyze_bibliographic_research(request: ExoplanetQuery):
    """
    Conduct bibliographic research using the Kepler agent
    """
    try:
        # Format the query for bibliographic research
        bibliographic_query = f"Conduct a comprehensive bibliographic research on: {request.planet_name}. Focus on recent scientific literature, key discoveries, and research methodologies."
        
        # Create the agent
        agent = create_agent()
        chat_history = []
        
        # Add the query to history
        chat_history.append({"role": "user", "content": bibliographic_query})
        
        # Run the agent
        result = Runner.run_streamed(agent, chat_history)
        response_content = ""
        tools_used = []
        
        async for event in result.stream_events():
            if event.type == "raw_response_event":
                data_type = getattr(event.data, "type", None)
                if hasattr(event.data, "delta"):
                    if data_type == "response.output_text.delta":
                        response_content += event.data.delta
                        
            elif event.type == "run_item_stream_event":
                item = event.item
                if item.type == "tool_call_item":
                    tool_name = getattr(item.raw_item, "name", "Tool")
                    if tool_name not in tools_used:
                        tools_used.append(tool_name)
        
        return AgentResponse(
            success=True,
            result=response_content,
            tools_used=tools_used
        )
        
    except Exception as e:
        return AgentResponse(
            success=False,
            error=str(e)
        )

@app.post("/grace-hopper/analyze", response_model=GraceHopperResponse)
async def analyze_with_grace_hopper(request: GraceHopperRequest):
    """
    Analyze an exoplanet using the Grace Hopper AI agent
    """
    try:
        print("🚀 GRACE HOPPER API REQUEST RECEIVED:")
        print("📋 Raw request.characteristics:", request.characteristics)
        print("📝 Raw request.query:", request.query)
        
        # Convert the characteristics dict to ExoplanetCharacteristics model
        characteristics = ExoplanetCharacteristics(**request.characteristics)
        
        print("✅ Converted characteristics:", characteristics.dict())
        
        # Analyze with Grace Hopper
        result = await analyze_exoplanet_with_grace_hopper(characteristics, request.query)
        
        return GraceHopperResponse(
            success=result["success"],
            result=result.get("result"),
            error=result.get("error"),
            tools_used=result.get("tools_used")
        )
        
    except Exception as e:
        return GraceHopperResponse(
            success=False,
            error=str(e)
        )

@app.post("/grace-hopper/analyze-with-files", response_model=GraceHopperResponse)
async def analyze_with_files(
    characteristics: str = Form(...),
    jwst_image: Optional[UploadFile] = File(None),
    transit_data: Optional[UploadFile] = File(None)
):
    """
    Analyze an exoplanet with Grace Hopper including uploaded files
    """
    try:
        # Parse characteristics JSON
        char_dict = json.loads(characteristics)
        characteristics_obj = ExoplanetCharacteristics(**char_dict)
        
        # Prepare analysis query with file information
        query = "Please provide a comprehensive analysis of this exoplanet"
        
        if jwst_image:
            query += f" (JWST image provided: {jwst_image.filename})"
        if transit_data:
            query += f" (Transit data provided: {transit_data.filename})"
        
        # For now, we'll analyze without processing the files
        # In a full implementation, you would process the files here
        result = await analyze_exoplanet_with_grace_hopper(characteristics_obj, query)
        
        return GraceHopperResponse(
            success=result["success"],
            result=result.get("result"),
            error=result.get("error"),
            tools_used=result.get("tools_used")
        )
        
    except Exception as e:
        return GraceHopperResponse(
            success=False,
            error=str(e)
        )

@app.get("/kepler/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "agent": "Johannes Kepler", "version": "1.0.0"}

@app.get("/grace-hopper/health")
async def grace_hopper_health_check():
    """
    Grace Hopper health check endpoint
    """
    return {
        "status": "healthy", 
        "agent": "Grace Hopper", 
        "version": "1.0.0"
    }

# ---------------- Routes ML ----------------
@app.get("/health")
def health():
    return {"status": "ok", "model_path": MODEL_PATH, "version": APP_VERSION}

@app.get("/model")
def model_info():
    return {"num_cols": _all_num_cols, "cat_cols": _cat_cols, "label_map": _label_map}

@app.post("/predict", response_model=PredictResponse)
def predict_one(item: ExoplanetInput):
    try:
        df = pd.DataFrame([item.dict(exclude_none=True)])
        pred = _predict_df(df)
        result = pred.iloc[0][RESPONSE_COLUMNS].to_dict()
        return PredictResponse(**result)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.exception("Prediction error: %s", e)
        raise HTTPException(status_code=500, detail="Internal prediction error")

@app.post("/predict/batch", response_model=BatchPredictResponse)
def predict_batch(items: List[ExoplanetInput]):
    if not items:
        raise HTTPException(status_code=400, detail="Empty payload")
    try:
        df = pd.DataFrame([it.dict(exclude_none=True) for it in items])
        pred = _predict_df(df)
        results = [PredictResponse(**row[RESPONSE_COLUMNS].to_dict()) for _, row in pred.iterrows()]
        return BatchPredictResponse(results=results)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.exception("Batch prediction error: %s", e)
        raise HTTPException(status_code=500, detail="Internal prediction error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)