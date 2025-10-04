"use client";
import React, { useState, useEffect, useRef } from "react";

interface JupyterLiteNotebookProps {
  height?: number;
  notebookUrl?: string;
  formData?: any;
}

export default function JupyterLiteNotebook({ 
  height = 600, 
  notebookUrl,
  formData 
}: JupyterLiteNotebookProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // JupyterLite URLs
  const jupyterLiteBaseUrl = "https://jupyterlite.readthedocs.io/en/stable/_static";
  const jupyterLabUrl = `${jupyterLiteBaseUrl}/lab/index.html`;
  
  // Create a notebook with exoplanet analysis content
  const createNotebookContent = () => {
    return {
      "cells": [
        {
          "cell_type": "markdown",
          "metadata": {},
          "source": [
            "# 🔭 Grace Hopper Exoplanet Analysis\n",
            "\n",
            "This notebook provides tools for analyzing exoplanet data using the parameters from the Grace Hopper form.\n",
            "\n",
            "## Available Data\n",
            "- Mission: KEPLER, K2, TESS, NEW\n",
            "- Host Star Name\n",
            "- Orbital Period (days)\n",
            "- Transit Duration (hours)\n",
            "- Transit Depth (ppm)\n",
            "- Stellar Effective Temperature (K)\n",
            "- Stellar logg (dex)\n",
            "- Stellar Radius (R☉)\n",
            "- Photometric Magnitude"
          ]
        },
        {
          "cell_type": "code",
          "execution_count": null,
          "metadata": {},
          "source": [
            "# Import required libraries\n",
            "import numpy as np\n",
            "import matplotlib.pyplot as plt\n",
            "import pandas as pd\n",
            "\n",
            "print(\"🌟 Grace Hopper Exoplanet Analysis Toolkit\")\n",
            "print(\"=\" * 50)"
          ],
          "outputs": []
        },
        {
          "cell_type": "code",
          "execution_count": null,
          "metadata": {},
          "source": [
            "# Form data from Grace Hopper (you can modify these values)\n",
            "exoplanet_data = {\n",
            "    'mission': 'KEPLER',  # KEPLER, K2, TESS, NEW\n",
            "    'host_name': 'Kepler-452',\n",
            "    'period': 384.8,  # days\n",
            "    'duration': 10.5,  # hours\n",
            "    'depth': 492,  # ppm\n",
            "    'st_teff': 5757,  # K\n",
            "    'st_logg': 4.32,  # dex\n",
            "    'st_rad': 1.11,  # R☉\n",
            "    'mag': 13.426  # magnitude\n",
            "}\n",
            "\n",
            "print(\"📊 Current Exoplanet Data:\")\n",
            "for key, value in exoplanet_data.items():\n",
            "    print(f\"  {key}: {value}\")"
          ],
          "outputs": []
        },
        {
          "cell_type": "code",
          "execution_count": null,
          "metadata": {},
          "source": [
            "def analyze_habitability(period, st_teff, st_rad):\n",
            "    \"\"\"\n",
            "    Analyze the habitability potential of an exoplanet\n",
            "    \n",
            "    Parameters:\n",
            "    - period: Orbital period in days\n",
            "    - st_teff: Stellar effective temperature in K\n",
            "    - st_rad: Stellar radius in solar radii\n",
            "    \n",
            "    Returns:\n",
            "    - Dictionary with habitability metrics\n",
            "    \"\"\"\n",
            "    # Calculate orbital distance using Kepler's 3rd law (simplified)\n",
            "    # Assumes stellar mass = 1 solar mass\n",
            "    distance_au = (period / 365.25) ** (2/3)\n",
            "    \n",
            "    # Calculate stellar luminosity (L/L☉)\n",
            "    stellar_luminosity = (st_rad ** 2) * ((st_teff / 5778) ** 4)\n",
            "    \n",
            "    # Calculate received flux (relative to Earth)\n",
            "    received_flux = stellar_luminosity / (distance_au ** 2)\n",
            "    \n",
            "    # Determine habitability zone\n",
            "    if 0.5 <= received_flux <= 2.0:\n",
            "        habitability = \"Potentially Habitable 🌍\"\n",
            "    elif received_flux < 0.5:\n",
            "        habitability = \"Too Cold ❄️\"\n",
            "    else:\n",
            "        habitability = \"Too Hot 🔥\"\n",
            "    \n",
            "    return {\n",
            "        'orbital_distance_au': distance_au,\n",
            "        'stellar_luminosity': stellar_luminosity,\n",
            "        'received_flux': received_flux,\n",
            "        'habitability': habitability\n",
            "    }\n",
            "\n",
            "# Analyze current exoplanet\n",
            "hab_analysis = analyze_habitability(\n",
            "    exoplanet_data['period'],\n",
            "    exoplanet_data['st_teff'],\n",
            "    exoplanet_data['st_rad']\n",
            ")\n",
            "\n",
            "print(\"\\n🔬 Habitability Analysis:\")\n",
            "print(f\"Orbital Distance: {hab_analysis['orbital_distance_au']:.3f} AU\")\n",
            "print(f\"Stellar Luminosity: {hab_analysis['stellar_luminosity']:.3f} L☉\")\n",
            "print(f\"Received Flux: {hab_analysis['received_flux']:.3f} (Earth = 1.0)\")\n",
            "print(f\"Assessment: {hab_analysis['habitability']}\")"
          ],
          "outputs": []
        },
        {
          "cell_type": "code",
          "execution_count": null,
          "metadata": {},
          "source": [
            "def analyze_transit(period, duration, depth, st_rad):\n",
            "    \"\"\"\n",
            "    Analyze transit properties to estimate planet characteristics\n",
            "    \n",
            "    Parameters:\n",
            "    - period: Orbital period in days\n",
            "    - duration: Transit duration in hours\n",
            "    - depth: Transit depth in ppm\n",
            "    - st_rad: Stellar radius in solar radii\n",
            "    \n",
            "    Returns:\n",
            "    - Dictionary with planet properties\n",
            "    \"\"\"\n",
            "    # Convert depth from ppm to fraction\n",
            "    depth_fraction = depth / 1e6\n",
            "    \n",
            "    # Calculate planet-to-star radius ratio\n",
            "    radius_ratio = np.sqrt(depth_fraction)\n",
            "    \n",
            "    # Calculate planet radius in Earth radii\n",
            "    # Solar radius = 109 Earth radii\n",
            "    planet_radius_earth = radius_ratio * st_rad * 109\n",
            "    \n",
            "    # Estimate planet type based on radius\n",
            "    if planet_radius_earth < 1.25:\n",
            "        planet_type = \"Rocky (Earth-like) 🌍\"\n",
            "    elif planet_radius_earth < 2.0:\n",
            "        planet_type = \"Super-Earth 🌎\"\n",
            "    elif planet_radius_earth < 4.0:\n",
            "        planet_type = \"Mini-Neptune 🔵\"\n",
            "    else:\n",
            "        planet_type = \"Gas Giant 🪐\"\n",
            "    \n",
            "    return {\n",
            "        'radius_ratio': radius_ratio,\n",
            "        'planet_radius_earth': planet_radius_earth,\n",
            "        'planet_type': planet_type,\n",
            "        'transit_depth_fraction': depth_fraction\n",
            "    }\n",
            "\n",
            "# Analyze current exoplanet transit\n",
            "transit_analysis = analyze_transit(\n",
            "    exoplanet_data['period'],\n",
            "    exoplanet_data['duration'],\n",
            "    exoplanet_data['depth'],\n",
            "    exoplanet_data['st_rad']\n",
            ")\n",
            "\n",
            "print(\"\\n🌟 Transit Analysis:\")\n",
            "print(f\"Planet/Star Radius Ratio: {transit_analysis['radius_ratio']:.4f}\")\n",
            "print(f\"Planet Radius: {transit_analysis['planet_radius_earth']:.2f} Earth radii\")\n",
            "print(f\"Planet Type: {transit_analysis['planet_type']}\")\n",
            "print(f\"Transit Depth: {transit_analysis['transit_depth_fraction']:.6f} ({exoplanet_data['depth']} ppm)\")"
          ],
          "outputs": []
        },
        {
          "cell_type": "code",
          "execution_count": null,
          "metadata": {},
          "source": [
            "# Create visualizations\n",
            "fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))\n",
            "\n",
            "# 1. Transit Light Curve Simulation\n",
            "time_hours = np.linspace(-exoplanet_data['duration'], exoplanet_data['duration'], 1000)\n",
            "transit_mask = np.abs(time_hours) <= exoplanet_data['duration']/2\n",
            "flux = np.ones_like(time_hours)\n",
            "flux[transit_mask] = 1 - (exoplanet_data['depth'] / 1e6)\n",
            "\n",
            "ax1.plot(time_hours, flux, 'b-', linewidth=2)\n",
            "ax1.set_xlabel('Time from transit center (hours)')\n",
            "ax1.set_ylabel('Relative Flux')\n",
            "ax1.set_title(f'Simulated Transit Light Curve\\n{exoplanet_data[\"host_name\"]} system')\n",
            "ax1.grid(True, alpha=0.3)\n",
            "\n",
            "# 2. Habitability Zone Diagram\n",
            "distances = np.linspace(0.1, 3.0, 100)\n",
            "fluxes = hab_analysis['stellar_luminosity'] / (distances ** 2)\n",
            "\n",
            "ax2.plot(distances, fluxes, 'r-', linewidth=2, label='Received Flux')\n",
            "ax2.axhline(y=1.0, color='g', linestyle='--', alpha=0.7, label='Earth flux')\n",
            "ax2.axhspan(0.5, 2.0, alpha=0.2, color='green', label='Habitable Zone')\n",
            "ax2.axvline(x=hab_analysis['orbital_distance_au'], color='blue', linestyle='-', \n",
            "           label=f'Planet orbit ({hab_analysis[\"orbital_distance_au\"]:.2f} AU)')\n",
            "ax2.set_xlabel('Distance from Star (AU)')\n",
            "ax2.set_ylabel('Received Flux (Earth = 1)')\n",
            "ax2.set_title('Habitability Zone Analysis')\n",
            "ax2.legend()\n",
            "ax2.grid(True, alpha=0.3)\n",
            "ax2.set_yscale('log')\n",
            "\n",
            "# 3. Planet Size Comparison\n",
            "planet_types = ['Earth', 'Super-Earth', 'Mini-Neptune', 'Gas Giant']\n",
            "size_ranges = [1.0, 1.625, 3.0, 8.0]  # Average radii in Earth radii\n",
            "colors = ['blue', 'green', 'orange', 'red']\n",
            "\n",
            "bars = ax3.bar(planet_types, size_ranges, color=colors, alpha=0.7)\n",
            "ax3.axhline(y=transit_analysis['planet_radius_earth'], color='purple', \n",
            "           linestyle='--', linewidth=2, \n",
            "           label=f'Our Planet ({transit_analysis[\"planet_radius_earth\"]:.2f} R⊕)')\n",
            "ax3.set_ylabel('Planet Radius (Earth radii)')\n",
            "ax3.set_title('Planet Size Classification')\n",
            "ax3.legend()\n",
            "ax3.grid(True, alpha=0.3)\n",
            "\n",
            "# 4. Mission Statistics (sample data)\n",
            "missions = ['KEPLER', 'K2', 'TESS', 'NEW']\n",
            "discoveries = [2662, 479, 5000, 1]  # Approximate numbers\n",
            "colors_mission = ['gold', 'orange', 'red', 'purple']\n",
            "\n",
            "wedges, texts, autotexts = ax4.pie(discoveries, labels=missions, colors=colors_mission, \n",
            "                                  autopct='%1.1f%%', startangle=90)\n",
            "ax4.set_title('Exoplanet Discoveries by Mission')\n",
            "\n",
            "# Highlight current mission\n",
            "current_mission_idx = missions.index(exoplanet_data['mission'])\n",
            "wedges[current_mission_idx].set_edgecolor('black')\n",
            "wedges[current_mission_idx].set_linewidth(3)\n",
            "\n",
            "plt.tight_layout()\n",
            "plt.show()\n",
            "\n",
            "print(f\"\\n📈 Analysis complete for {exoplanet_data['host_name']} system!\")\n",
            "print(f\"Mission: {exoplanet_data['mission']}\")\n",
            "print(f\"Planet classification: {transit_analysis['planet_type']}\")\n",
            "print(f\"Habitability: {hab_analysis['habitability']}\")"
          ],
          "outputs": []
        },
        {
          "cell_type": "markdown",
          "metadata": {},
          "source": [
            "## 🔧 Interactive Analysis\n",
            "\n",
            "Modify the `exoplanet_data` dictionary above with your own values from the Grace Hopper form, then re-run the analysis cells to see how the results change!\n",
            "\n",
            "### Key Functions:\n",
            "- `analyze_habitability()`: Determines if a planet is in the habitable zone\n",
            "- `analyze_transit()`: Estimates planet size and type from transit data\n",
            "\n",
            "### Next Steps:\n",
            "1. Update the exoplanet_data with your form values\n",
            "2. Run all cells to see the complete analysis\n",
            "3. Experiment with different parameter values\n",
            "4. Add your own analysis functions!"
          ]
        }
      ],
      "metadata": {
        "kernelspec": {
          "display_name": "Python 3 (ipykernel)",
          "language": "python",
          "name": "python3"
        },
        "language_info": {
          "codemirror_mode": {
            "name": "ipython",
            "version": 3
          },
          "file_extension": ".py",
          "mimetype": "text/x-python",
          "name": "python",
          "nbconvert_exporter": "python",
          "pygments_lexer": "ipython3",
          "version": "3.11.0"
        }
      },
      "nbformat": 4,
      "nbformat_minor": 4
    };
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    // Try to inject notebook content after JupyterLite loads
    setTimeout(() => {
      if (iframeRef.current && formData) {
        try {
          // Send form data to JupyterLite (if possible)
          const message = {
            type: 'grace_hopper_data',
            data: formData
          };
          iframeRef.current.contentWindow?.postMessage(message, '*');
        } catch (error) {
          console.log('Could not send data to JupyterLite:', error);
        }
      }
    }, 3000);
  };

  const handleIframeError = () => {
    setError("Failed to load JupyterLite. Please check your internet connection.");
    setIsLoading(false);
  };

  const downloadNotebook = () => {
    const notebook = createNotebookContent();
    const dataStr = JSON.stringify(notebook, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'grace_hopper_exoplanet_analysis.ipynb';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      width: "100%",
      height: height,
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid rgba(188,210,255,0.25)",
      background: "rgba(6,12,26,0.8)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)"
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid rgba(188,210,255,0.15)",
        background: "rgba(20,30,60,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ff5f57"
          }} />
          <div style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ffbd2e"
          }} />
          <div style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#28ca42"
          }} />
          <span style={{
            marginLeft: 12,
            color: "#e6f0ff",
            fontSize: 14,
            fontWeight: 600
          }}>
            🐍 JupyterLite - Exoplanet Analysis Notebook
          </span>
        </div>
        
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={downloadNotebook}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid rgba(74,222,128,0.3)",
              background: "rgba(74,222,128,0.2)",
              color: "#e6f0ff",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            📥 Download Notebook
          </button>
          <a
            href={jupyterLabUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid rgba(168,85,247,0.3)",
              background: "rgba(168,85,247,0.2)",
              color: "#e6f0ff",
              fontSize: 12,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            🚀 Open in New Tab
          </a>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          textAlign: "center",
          color: "#e6f0ff"
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(168,85,247,0.3)",
            borderTop: "3px solid #a855f7",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p style={{ margin: 0, fontSize: 14 }}>Loading JupyterLite...</p>
          <p style={{ margin: "8px 0 0 0", fontSize: 12, opacity: 0.7 }}>
            This may take a moment on first load
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          textAlign: "center",
          color: "#ff6b6b",
          padding: 20
        }}>
          <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
            }}
            style={{
              marginTop: 12,
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid rgba(255,107,107,0.3)",
              background: "rgba(255,107,107,0.1)",
              color: "#ff6b6b",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* JupyterLite iframe */}
      <iframe
        ref={iframeRef}
        src={jupyterLabUrl}
        width="100%"
        height={height - 60} // Account for header
        style={{
          border: "none",
          display: isLoading || error ? "none" : "block"
        }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title="JupyterLite Notebook"
        sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-forms"
        allow="cross-origin-isolated"
      />

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
