# Astronomist Agents Package
# 
# This package contains specialized AI agents for exoplanet analysis:
# - Johannes Kepler Agent: Comprehensive exoplanet analysis using NASA archives
# - Grace Hopper Agent: Advanced research with ML classification capabilities

from .grace_hopper_agent import (
    create_grace_hopper_agent,
    analyze_exoplanet_with_grace_hopper,
    ExoplanetCharacteristics,
    MLPrediction
)

from .johannes_kepler_agent import (
    create_agent as create_johannes_kepler_agent
)

__version__ = "1.0.0"
__author__ = "Astronomist Team"
