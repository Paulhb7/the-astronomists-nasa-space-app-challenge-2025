#!/usr/bin/env python3
"""
Script to start the Johannes Kepler AI Agent API server
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Check if required environment variables are set
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Error: OPENAI_API_KEY is not set in environment variables")
        print("Please create a .env file with your OpenAI API key")
        exit(1)
    
    if not os.getenv("PERPLEXITY_API_KEY"):
        print("❌ Error: PERPLEXITY_API_KEY is not set in environment variables")
        print("Please create a .env file with your Perplexity API key")
        exit(1)
    
    print("🚀 Starting Johannes Kepler AI Agent API...")
    print("📡 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/kepler/health")
    print("=" * 50)
    
    # Start the server
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
