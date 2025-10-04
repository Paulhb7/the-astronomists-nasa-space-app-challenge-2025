# -*- coding: utf-8 -*-
import os
import requests
import asyncio
from typing import List, Dict, cast, Optional
from urllib.parse import quote
from dotenv import load_dotenv
from pydantic import BaseModel
import xml.etree.ElementTree as ET

# Agent framework imports
from agents import (
    Agent,
    OpenAIChatCompletionsModel,
    Runner,
    function_tool,
    set_tracing_disabled,
)

# Astroquery imports
from astroquery.ipac.nexsci.nasa_exoplanet_archive import NasaExoplanetArchive

# ----------------------------
# Chargement des variables d'environnement
# ----------------------------
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set. Please ensure it is defined in your .env file.")

if not PERPLEXITY_API_KEY:
    raise ValueError("PERPLEXITY_API_KEY n'est pas défini. Ajoute-le à ton fichier .env")

model = "gpt-5-mini-2025-08-07"

# ----------------------------
# Tool Open Science Research
# ----------------------------
class ScientificArticle(BaseModel):
    title: Optional[str]
    abstract: Optional[str]
    link: Optional[str]
    source: Optional[str]

@function_tool
def open_science_database_research(query: str, n: int = 10) -> List[ScientificArticle]:
    """Recherche sur arXiv uniquement. Retourne les résultats sous forme de liste d’objets."""
    articles = []

    # arXiv
    def get_arxiv_abstracts(query, n):
        url = "http://export.arxiv.org/api/query"
        params = {
            "search_query": f"all:{query}",
            "start": 0,
            "max_results": n
        }
        resp = requests.get(url, params=params)
        root = ET.fromstring(resp.text)
        results = []
        for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
            title = entry.find('{http://www.w3.org/2005/Atom}title').text.strip()
            abstract = entry.find('{http://www.w3.org/2005/Atom}summary').text.strip()
            link = entry.find('{http://www.w3.org/2005/Atom}id').text
            results.append({'title': title, 'abstract': abstract, 'link': link})
        return results

    # Récupération et construction objets
    for r in get_arxiv_abstracts(query, n):
        articles.append(ScientificArticle(
            title=r['title'],
            abstract=r['abstract'],
            link=r['link'],
            source="arXiv"
        ))

    return articles

@function_tool
async def sonar_intelligence_research(query: str, model: str = "sonar") -> str:
    """
    Conduct comprehensive scientific literature research on an exoplanet or a star using Perplexity AI.
    
    Args:
        query: Research-focused query related to an exoplanet or a star
               (e.g., "atmospheric characterization of WASP-39b",
               "stellar variability of Proxima Centauri", 
               "JWST results on TRAPPIST-1").
        model: Perplexity model to use (default: llama-3.1-sonar-small-128k-online)
    
    Returns:
        Structured scientific literature review with citations, 
        focusing on recent astrophysics research.
    """
    
    if not PERPLEXITY_API_KEY:
        return "Error: PERPLEXITY_API_KEY not found in environment variables"
    
    url = "https://api.perplexity.ai/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Astrophysics-focused system prompt
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": """You are an expert astrophysicist and scientific literature analyst 
                specializing in exoplanets and stellar physics.
                
                Focus exclusively on:
                - Discoveries and characterization of exoplanets
                - Atmospheric studies, spectroscopy, and potential habitability indicators
                - Stellar properties, variability, and evolutionary stages
                - Results from major observatories and space telescopes 
                  (JWST, Hubble, TESS, Kepler, Gaia, ground-based instruments)
                - Methodological approaches (transit photometry, radial velocity, direct imaging, asteroseismology)
                - Peer-reviewed astrophysics journals (A&A, ApJ, MNRAS, AJ, PASP) and arXiv preprints
                - Recent breakthroughs and observational campaigns
                - Data reproducibility, uncertainties, and instrumental limitations
                - Implications for astrobiology and planetary system formation
                
                Always prioritize:
                - Peer-reviewed astrophysics sources over preprints when possible
                - Publications from the last 2–3 years unless historical context is essential
                - Specific citations with DOIs, ADS bibcodes, or arXiv IDs
                - Critical evaluation of methodologies, instrumentation, and results
                - Future missions, telescope developments, and research directions
                
                Present the information in a structured academic format, 
                focusing strictly on exoplanets and stars."""
            },
            {
                "role": "user", 
                "content": query
            }
        ],
        "max_tokens": 2000,
        "temperature": 0.2,
        "top_p": 0.9
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        if 'choices' in data and len(data['choices']) > 0:
            content = data['choices'][0]['message']['content']
            
            # Add a scientific header
            result = f"🔭 Astrophysics Literature Research: '{query}'\n\n"
            result += content
            
            if 'usage' in data:
                tokens_used = data['usage'].get('total_tokens', 0)
                result += f"\n\n📊 Research Analysis: {tokens_used} tokens used\n"
            
            return result
        else:
            return f"No research results found for astrophysics query: {query}"
            
    except requests.exceptions.RequestException as e:
        return f"Astrophysics Research API Error: {str(e)}"
    except Exception as e:
        return f"Unexpected error in astrophysics literature research: {str(e)}"

# ----------------------------
# Tools – Exoplanet Astroquery
# ----------------------------

@function_tool
def astroquery_exoplanet_lookup(planet_name: str) -> Dict:
    """
    Query exoplanet data using astroquery NasaExoplanetArchive.
    Returns detailed exoplanet parameters from the NASA Exoplanet Archive.
    
    Args:
        planet_name: Name of the exoplanet to search for (e.g., 'K2-18 b', 'Kepler-22b')
    
    Returns:
        Dictionary containing the astroquery results with all available parameters
    """
    try:
        # Query the NASA Exoplanet Archive using astroquery
        tab = NasaExoplanetArchive.query_criteria(
            table="pscomppars",
            select="pl_name,hostname,disc_year,discoverymethod,pl_orbper,pl_orbsmax,pl_orbeccen,pl_rade,pl_masse,pl_eqt,st_teff,st_mass,st_rad,sy_dist,ra,dec,sy_hmag,sy_hmagerr1,sy_hmagerr2",
            where=f"pl_name='{planet_name}'"
        )
        
        if len(tab) == 0:
            # Try a more flexible search if exact match fails
            tab = NasaExoplanetArchive.query_criteria(
                table="pscomppars",
                select="pl_name,hostname,disc_year,discoverymethod,pl_orbper,pl_orbsmax,pl_orbeccen,pl_rade,pl_masse,pl_eqt,st_teff,st_mass,st_rad,sy_dist,ra,dec,sy_hmag,sy_hmagerr1,sy_hmagerr2",
                where=f"pl_name LIKE '%{planet_name}%'"
            )
        
        if len(tab) == 0:
            return {
                "success": False,
                "message": f"No exoplanet found with name '{planet_name}'",
                "results": []
            }
        
        # Convert astropy table to dictionary format
        results = []
        for row in tab:
            result = {}
            for col in tab.colnames:
                value = row[col]
                # Handle masked values and convert to Python types
                if hasattr(value, 'mask') and value.mask:
                    result[col] = None
                else:
                    result[col] = value.item() if hasattr(value, 'item') else value
            results.append(result)
        
        print(f"[info] Astroquery returned {len(results)} records for '{planet_name}'", flush=True)
        
        return {
            "success": True,
            "message": f"Found {len(results)} record(s) for '{planet_name}'",
            "results": results,
            "query_info": {
                "table": "pscomppars",
                "planet_searched": planet_name,
                "columns_returned": list(tab.colnames)
            }
        }
        
    except Exception as e:
        print(f"[error] Astroquery lookup failed: {str(e)}", flush=True)
        return {
            "success": False,
            "message": f"Error querying exoplanet '{planet_name}': {str(e)}",
            "results": []
        }

# ----------------------------
# Agent Johannes Kepler
# ----------------------------

def create_agent() -> Agent:
    """Creates the exoplanet intelligence agent"""
    return Agent(
        name="Johannes Kepler",
        instructions="""
        You are an astrophysics research analyst specialized in **exoplanets**.
        Your mission is to produce concise, actionable syntheses for scientists and students,
        combining authoritative catalog data (NASA Exoplanet Archive) and recent literature (arXiv/astro-ph).

        **Your role:**
        - Fetch authoritative parameters for a given exoplanet or host star.
        - Summarize discovery context, key references, and recent observational highlights (e.g., JWST).
        - Compare multiple planets within the same system when asked.
        - Provide clear units, uncertainties where available, and direct archive links.

        **Workflow:**
        - If the user gives an exoplanet name, query the NASA Exoplanet Archive using `astroquery_exoplanet_lookup` to get detailed parameters and observational data.
        - For scientific literature on that exoplanet (methods, observations, atmospheres, JWST…), call `open_science_database_research` with the object name or theme.
        - For broader **web search & synthesis** about the exoplanet (news, datasets, blogs, institutional pages), call `sonar_intelligence_research` (Perplexity online).

        **Response format:**
        - *Begin with a one-line italic summary of the approach taken.*
        - **Use bold section headers.**
        - Present a compact parameter table/bullets (period, mass/radius, a, e, Teq, star Teff/M/R, distance).
        - Link back to the NASA archive page for the object.
        - Cite 3–6 recent papers with one-line takeaways.

        **Important:** Always respond in English, regardless of the input language.

        Keep things precise and avoid speculative claims.
        """,
        model=model,
        tools=[astroquery_exoplanet_lookup, open_science_database_research, sonar_intelligence_research],
    )

async def call_kepler_api(planet_name: str, custom_query: str = None):
    """Calls the Kepler API to analyze an exoplanet"""
    import httpx
    
    print(f"🔭 Analyzing {planet_name} via Kepler API")
    print("=" * 50)
    
    # Prepare the query
    query = custom_query or f"Give me a synthetic sheet for exoplanet {planet_name} (key parameters, host star, discoveries & references)."
    
    print(f"Question: {query}")
    print("\n🤖 Calling Kepler API...", end="", flush=True)
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8000/kepler/analyze",
                json={
                    "planet_name": planet_name,
                    "query": query
                },
                timeout=60.0
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("success"):
                    print(" ✅")
                    print("\n" + "=" * 50)
                    print("🧠 KEPLER ANALYSIS RESULT")
                    print("=" * 50)
                    
                    if data.get("tools_used"):
                        print(f"🔧 Tools used: {', '.join(data['tools_used'])}")
                        print()
                    
                    print(data.get("result", "No result"))
                    print("\n" + "=" * 50)
                    print("✅ Analysis completed!")
                else:
                    print(" ❌")
                    print(f"\n❌ API Error: {data.get('error', 'Unknown error')}")
            else:
                print(" ❌")
                print(f"\n❌ HTTP Error {response.status_code}: {response.text}")
                
    except httpx.ConnectError:
        print(" ❌")
        print("\n❌ Error: Unable to connect to Kepler API")
        print("💡 Make sure the API is running on http://localhost:8000")
    except Exception as e:
        print(" ❌")
        print(f"\n❌ Error: {str(e)}")

if __name__ == "__main__":
    import sys
    
    # Get exoplanet name from command line arguments
    if len(sys.argv) > 1:
        planet_name = sys.argv[1]
        custom_query = sys.argv[2] if len(sys.argv) > 2 else None
    else:
        planet_name = "Kepler-22b"  # Default
        custom_query = None
    
    asyncio.run(call_kepler_api(planet_name, custom_query))