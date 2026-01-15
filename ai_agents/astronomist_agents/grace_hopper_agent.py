# -*- coding: utf-8 -*-
import os
import asyncio
import json
from typing import Optional

from pydantic import BaseModel

from celeste import Capability, Provider, create_client

# Celeste model id (registered in celeste-python)
MODEL_ID = os.getenv("GRACE_HOPPER_MODEL_ID", "gpt-4o")

CLIENT = create_client(
    capability=Capability.TEXT_GENERATION,
    provider=Provider.OPENAI,
    model=MODEL_ID,
)

GRACE_HOPPER_INSTRUCTIONS = """
        You are **Grace Hopper Exoplanet Analysis Agent**, an AI exoplanet analysis specialist. Your mission: analyze observational data characteristics to assess their physical plausibility, then compare with ML classifier results for consistency evaluation.

        **OBJECTIVE**: 
        1. **PRIMARY**: Analyze observational characteristics for physical plausibility and exoplanet indicators
        2. **SECONDARY**: Compare ML classification scores with your observational analysis → Assess consistency

        **INPUT DATA CONTEXT & MEANING**:
        - **mission**: Kepler/K2/TESS (each has distinct instrumental signatures, detection biases, and stellar samples)
        - **period**: Orbital period in days (physical constraint: P ∝ a³/², affects transit frequency and stability)
        - **duration**: Transit duration in hours (Tdur ∝ R*/a¹/₂, reveals stellar density and orbital architecture)
        - **depth**: Transit depth (fraction of flux blocked: δ ∝ (Rp/R*)², directly constrains planet radius)
        - **st_teff**: Stellar effective temperature in K (spectral type proxy, affects habitable zone boundaries)
        - **st_logg**: Surface gravity in dex (stellar evolution stage, affects stellar density calculations)
        - **st_rad**: Stellar radius in solar radii (R☉) (scales transit depth interpretation and physical constraints)
        - **mag**: Photometric magnitude (mission-dependent: Kepler mag or TESS mag, affects detection thresholds)
        - **ml_prediction**: ML classifier output (probability scores for each classification category)

        **CRITICAL**: Only use provided data. No external lookups or research.

        **ANALYSIS WORKFLOW**:
        1. 📊 **Observational Analysis**: Analyze the physical characteristics for plausible exoplanet signatures
        2. 🔬 **Data Quality Assessment**: Evaluate data consistency and physical constraints
        3. 🤖 **ML Comparison**: Compare ML scores with your observational assessment
        4. ⚖️ **Consistency Evaluation**: Assess whether ML classification aligns with physical evidence
        5. 💡 **Science Insights**: Highlight key findings and validation implications

        **RESPONSE FORMAT**:
        ```
        📊 OBSERVATIONAL ANALYSIS
        Physical Characteristics Assessment:
        - Period-Durational Consistency: [analysis of P vs Tdur relationship]
        - Depth-Size Constraints: [analysis of δ vs stellar parameters]
        - Stellar Context: [analysis of stellar properties for exoplanet hosting]
        - Mission-Specific Patterns: [mission detection biases and signatures]
        
        📋 DETAILED DATA BREAKDOWN
        Observed Values: [complete characteristic listing with units]
        Derived Constraints: [physical implications from measurements]
        ML Scores: [detailed probability breakdown]
        
        ⚖️ ML vs OBSERVATIONAL CONSISTENCY
        Physical Plausibility: [your assessment]
        ML Classification: [predicted label & confidence]
        Consistency Analysis: [comparison and alignment]
        
        🎯 EVALUATION & RECOMMENDATIONS
        Key Findings: [primary conclusions]
        Validation Priority: [follow-up observation recommendations]
        Confidence Assessment: [data quality and ML reliability]
        ```

        **ANALYSIS PRIORITY**: Always start with physical observational analysis first, then evaluate ML consistency. Data drives the assessment, not ML prediction.

        """

# ----------------------------
# Grace Hopper Data Models
# ----------------------------

class MLPrediction(BaseModel):
    """Machine Learning prediction results"""
    pred_label: str
    p_CONFIRMED: float
    p_CANDIDATE: float
    p_FALSE_POSITIVE: float

class ExoplanetCharacteristics(BaseModel):
    # Original fields from frontend form - NO NAMES TO PREVENT EXTERNAL LOOKUPS
    mission: Optional[str] = None
    period: Optional[float] = None  # days
    duration: Optional[float] = None  # hours
    depth: Optional[float] = None  # ppm
    st_teff: Optional[float] = None  # Kelvin
    st_logg: Optional[float] = None  # dex
    st_rad: Optional[float] = None  # solar radii
    mag: Optional[float] = None
    
    # Grace Hopper fields - ONLY PHYSICAL CHARACTERISTICS, NO NAMES
    distance: Optional[float] = None  # parsecs
    stellar_type: Optional[str] = None
    orbital_period: Optional[float] = None  # days
    semi_major_axis: Optional[float] = None  # AU
    planet_radius: Optional[float] = None  # Earth radii
    planet_mass: Optional[float] = None  # Earth masses
    equilibrium_temp: Optional[float] = None  # Kelvin
    discovery_method: Optional[str] = None
    discovery_year: Optional[int] = None
    
    # ML Prediction results (optional)
    ml_prediction: Optional[MLPrediction] = None

# ----------------------------
# API Integration Functions
# ----------------------------

async def analyze_exoplanet_with_grace_hopper(characteristics: ExoplanetCharacteristics, query: str = None):
    """
    Analyze an exoplanet using the Grace Hopper AI agent
    """
    try:
        # Prepare the analysis query
        char_dict = characteristics.dict(exclude_none=True)
        
        print(f"🔬 GRACE HOPPER AGENT - Raw Characteristics (TOTAL KEYS: {len(char_dict.keys())}):")
        if not char_dict:
            print("❌ PROBLEM: char_dict is EMPTY!")
            print(f"🔬 Raw characteristics object: {characteristics}")
            print(f"🔬 characteristics.dict(): {characteristics.dict()}")
            print(f"🔬 characteristics.dict(exclude_none=True): {characteristics.dict(exclude_none=True)}")
        else:
            for key, value in char_dict.items():
                print(f"  {key}: {value} (type: {type(value)})")
        
        # Extract ML prediction if available
        ml_prediction = char_dict.pop('ml_prediction', None)
        
        print(f"🔬 After ML extraction, remaining characteristics:")
        for key, value in char_dict.items():
            print(f"  {key}: {value}")
        
        print(f"🔬 ML Prediction: {ml_prediction}")
        
        if query:
            # Enhance query with ML prediction if available
            if ml_prediction:
                ml_context = f"""
📊 MACHINE LEARNING CLASSIFICATION:
- Predicted Status: {ml_prediction['pred_label']}
- Confidence Scores:
  • CONFIRMED: {ml_prediction['p_CONFIRMED']*100:.1f}%
  • CANDIDATE: {ml_prediction['p_CANDIDATE']*100:.1f}%  
  • FALSE POSITIVE: {ml_prediction['p_FALSE_POSITIVE']*100:.1f}%

📊 OBSERVATIONAL DATA:
{json.dumps(char_dict, indent=2)}

🔍 SPECIFIC VALUES TO ANALYZE:
- Mission: {char_dict.get('mission', 'Not provided')}
- Period: {char_dict.get('period', 'Not provided')} days
- Duration: {char_dict.get('duration', 'Not provided')} hours  
- Depth: {char_dict.get('depth', 'Not provided')} ppm
- Stellar Teff: {char_dict.get('st_teff', 'Not provided')} K
- Stellar logg: {char_dict.get('st_logg', 'Not provided')} dex
- Stellar Radius: {char_dict.get('st_rad', 'Not provided')} R☉
- Magnitude: {char_dict.get('mag', 'Not provided')} mag

🎯 ANALYSIS REQUEST: Analyze these observational characteristics for physical plausibility, then compare with ML classification for consistency evaluation."""
                analysis_query = ml_context
            else:
                enhanced_query = f"{query}\n\n📊 Observational Data:\n{json.dumps(char_dict, indent=2)}\n\n🎯 ANALYSIS REQUEST: Analyze these observational characteristics for physical plausibility and exoplanet indicators."
                analysis_query = enhanced_query
        else:
            # Default query - Simple and direct
            if ml_prediction:
                analysis_query = f"""📊 EXOPLANET VALIDATION ANALYSIS

🤖 ML CLASSIFICATION: {ml_prediction['pred_label']} ({max(ml_prediction['p_CONFIRMED'], ml_prediction['p_CANDIDATE'], ml_prediction['p_FALSE_POSITIVE'])*100:.1f}% confidence)

📊 OBSERVATIONAL DATA:
{json.dumps(char_dict, indent=2)}

🔍 SPECIFIC VALUES TO ANALYZE:
- Mission: {char_dict.get('mission', 'Not provided')}
- Period: {char_dict.get('period', 'Not provided')} days
- Duration: {char_dict.get('duration', 'Not provided')} hours  
- Depth: {char_dict.get('depth', 'Not provided')} ppm
- Stellar Teff: {char_dict.get('st_teff', 'Not provided')} K
- Stellar logg: {char_dict.get('st_logg', 'Not provided')} dex
- Stellar Radius: {char_dict.get('st_rad', 'Not provided')} R☉
- Magnitude: {char_dict.get('mag', 'Not provided')} mag

🎯 TASK: Analyze observational characteristics for physical plausibility first, then compare with ML classification for consistency evaluation."""
            else:
                analysis_query = f"""📊 EXOPLANET ANALYSIS

📊 OBSERVATIONAL DATA:
{json.dumps(char_dict, indent=2)}

🔍 SPECIFIC VALUES TO ANALYZE:
- Mission: {char_dict.get('mission', 'Not provided')}
- Period: {char_dict.get('period', 'Not provided')} days
- Duration: {char_dict.get('duration', 'Not provided')} hours  
- Depth: {char_dict.get('depth', 'Not provided')} ppm
- Stellar Teff: {char_dict.get('st_teff', 'Not provided')} K
- Stellar logg: {char_dict.get('st_logg', 'Not provided')} dex
- Stellar Radius: {char_dict.get('st_rad', 'Not provided')} R☉
- Magnitude: {char_dict.get('mag', 'Not provided')} mag

🎯 TASK: Analyze these observational characteristics for physical plausibility and exoplanet indicators."""
        
        # Build a single prompt (Celeste text generation input is a string prompt)
        prompt = f"{GRACE_HOPPER_INSTRUCTIONS}\n\n{analysis_query}"

        output = await CLIENT.generate(prompt=prompt)
        response_content = output.content if isinstance(output.content, str) else str(output.content)
        
        return {
            "success": True,
            "result": response_content,
            "tools_used": []
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    # Test the agent
    test_characteristics = ExoplanetCharacteristics(
        mission="KEPLER",
        distance=430.0,
        stellar_type="G2V",
        orbital_period=384.8,
        semi_major_axis=1.04,
        planet_radius=1.6,
        equilibrium_temp=265,
        discovery_method="Transit",
        discovery_year=2015,
        period=384.8,
        depth=750,
        st_teff=5757,
        st_rad=1.11
    )
    
    async def test():
        result = await analyze_exoplanet_with_grace_hopper(
            test_characteristics,
            "Please analyze this exoplanet candidate based on the provided observational data and ML classification."
        )
        print("Grace Hopper Analysis Result:")
        print("=" * 50)
        if result["success"]:
            print(result["result"])
            print(f"\nTools used: {result['tools_used']}")
        else:
            print(f"Error: {result['error']}")
    
    asyncio.run(test())