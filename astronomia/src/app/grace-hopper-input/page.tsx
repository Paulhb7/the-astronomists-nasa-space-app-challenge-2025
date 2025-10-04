"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StarfieldHyperdrive from "../components/StarfieldHyperdrive";
import NavigationBar from "../components/NavigationMenu";
import JupyterLiteNotebook from "../components/JupyterLiteNotebook";
import LightCurveSimulator, { LightCurveData } from "../components/LightCurveSimulator";
import LightCurveVisualizer from "../components/LightCurveVisualizer";

export default function GraceHopperInputPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    mission: "",
    hostName: "",
    period: "",
    duration: "",
    depth: "",
    st_teff: "",
    st_logg: "",
    st_rad: "",
    mag: ""
  });

  const [jwstImage, setJwstImage] = useState<File | null>(null);
  const [transitData, setTransitData] = useState<File | null>(null);
  const [navigating, setNavigating] = useState(false);
  const [showFormData, setShowFormData] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);
  const [showLightCurves, setShowLightCurves] = useState(false);
  const [mlPrediction, setMlPrediction] = useState<any>(null);
  const [loadingMlPrediction, setLoadingMlPrediction] = useState(false);
  const [simulatedLightCurveData, setSimulatedLightCurveData] = useState<LightCurveData | null>(null);
  const [manualResults, setManualResults] = useState({
    pred_label: "",
    confidence: "",
    roc_auc: "",
    accuracy: "",
    precision_confirmed: "",
    recall_confirmed: "",
    f1_confirmed: "",
    precision_candidate: "",
    recall_candidate: "",
    f1_candidate: "",
    precision_false_positive: "",
    recall_false_positive: "",
    f1_false_positive: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'jwst' | 'transit') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'jwst') {
        setJwstImage(file);
      } else {
        setTransitData(file);
      }
    }
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualResults(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLightCurveDataGenerated = (data: LightCurveData) => {
    setSimulatedLightCurveData(data);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setNavigating(true);
    
    // Immediate navigation to report page - Grace Hopper analysis will happen there
    // Extract formData excluding hostName to prevent sending star names to Grace Hopper
    const { hostName, ...dataWithoutHostName } = formData;
    console.log("🚀 Sending to Grace Hopper (excluding hostName):", dataWithoutHostName);
    
    const params = new URLSearchParams({
      hasFiles: (jwstImage || transitData) ? 'true' : 'false',
      ...dataWithoutHostName
    });
    
    // Include ML prediction in URL if available
    if (mlPrediction) {
      params.append('ml_prediction', JSON.stringify(mlPrediction));
    }
    
    // Include manual ML results if any are filled
    const manualResultsFiltered = Object.fromEntries(
      Object.entries(manualResults).filter(([_, value]) => value !== '')
    );
    if (Object.keys(manualResultsFiltered).length > 0) {
      params.append('manual_ml_results', JSON.stringify(manualResultsFiltered));
    }
    
    // Navigate to report page where Grace Hopper analysis will be performed
    router.push(`/grace-hopper-report?${params.toString()}`);
    setNavigating(false);
  };

  const generateRandomData = () => {
    const missions = ["KEPLER", "K2", "TESS", "NEW"];
    // Real stars with NASA Eyes compatible names
    const realStars = [
      "Rigil_Kentaurus", "Alchiba", "Kepler-4", "Kepler-186", "TRAPPIST-1", "51_Eri", "Proxima_Centauri"
    ];
    
    // Generate realistic exoplanet data for the new fields
    const mission = missions[Math.floor(Math.random() * missions.length)];
    const hostName = realStars[Math.floor(Math.random() * realStars.length)];
    const period = (Math.random() * 500 + 0.5).toFixed(2); // Orbital period in days
    const duration = (Math.random() * 12 + 0.5).toFixed(2); // Transit duration in hours
    const depth = (Math.random() * 10000 + 100).toFixed(0); // Transit depth in ppm
    const st_teff = (Math.random() * 3000 + 3000).toFixed(0); // Stellar effective temperature in K
    const st_logg = (Math.random() * 2 + 3.5).toFixed(2); // Stellar logg in dex
    const st_rad = (Math.random() * 2 + 0.5).toFixed(2); // Stellar radius in solar radii
    const mag = (Math.random() * 10 + 8).toFixed(2); // Photometric magnitude
    
    setFormData({
      mission: mission,
      hostName: hostName,
      period: period,
      duration: duration,
      depth: depth,
      st_teff: st_teff,
      st_logg: st_logg,
      st_rad: st_rad,
      mag: mag
    });
  };

  const predictWithML = async () => {
    // Validate required fields
    if (!formData.mission || !formData.period || !formData.duration || !formData.depth) {
      alert('Please fill in all required fields (mission, period, duration, depth) for ML prediction');
      return;
    }

    setLoadingMlPrediction(true);
    
    try {
      // Prepare payload - only send fields that are available
      const payload: any = {
        mission: formData.mission.toUpperCase(),
        period: parseFloat(formData.period) || null,
        duration: parseFloat(formData.duration) || null,
        depth: parseFloat(formData.depth) || null,
      };

      // Add optional fields if they exist
      if (formData.st_teff) payload.st_teff = parseFloat(formData.st_teff);
      if (formData.st_logg) payload.st_logg = parseFloat(formData.st_logg);
      if (formData.st_rad) payload.st_rad = parseFloat(formData.st_rad);
      if (formData.mag) payload.mag = parseFloat(formData.mag);

      console.log('ML Prediction payload:', payload);

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('ML Prediction result:', result);
        setMlPrediction(result);
      } else {
        const error = await response.text();
        console.error('ML Prediction error:', error);
        alert(`ML Prediction failed: ${error}`);
      }
    } catch (error) {
      console.error('ML Prediction error:', error);
      alert(`ML Prediction error: ${error}`);
    } finally {
      setLoadingMlPrediction(false);
    }
  };


  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "auto" }}>
      <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
      
      {/* Navigation Bar */}
      <NavigationBar pageTitle="Grace Hopper AI" />

      

      {/* Main Content */}
      <div style={{ 
        position: "relative", 
        top: 0,
        left: "50%", 
        transform: "translateX(-50%)", 
        zIndex: 1,
        width: "95vw",
        maxWidth: 1200,
        textAlign: "center",
        padding: "80px 0 40px 0",
        minHeight: "calc(100vh - 80px)"
      }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ 
            color: "#e6f0ff", 
            fontSize: 24, 
            fontWeight: 700, 
            margin: "0 0 6px 0",
            textShadow: "0 0 20px rgba(140,170,255,0.3)"
          }}>
            🔭 Grace Hopper
          </h1>
          <p style={{ 
            color: "#a855f7", 
            fontSize: 12, 
            margin: "0 0 12px 0",
            fontWeight: 600,
            opacity: 0.9
          }}>
            New Exoplanet Analysis
          </p>
          <p style={{ 
            color: "#bcd2ff", 
            fontSize: 14, 
            margin: 0,
            lineHeight: 1.4
          }}>
            Enter exoplanet characteristics manually for advanced AI analysis
          </p>
        </div>

        {/* Form */}
        <div style={{ 
          background: "linear-gradient(135deg, rgba(20,30,60,0.6), rgba(6,12,26,0.8))",
          borderRadius: 16,
          border: "1px solid rgba(188,210,255,0.25)",
          padding: 24,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)"
        }}>
          <form onSubmit={handleSubmit}>
            {/* Toggle Buttons */}
            <div style={{ marginBottom: 20, textAlign: "center", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowFormData(!showFormData)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "1px solid rgba(168, 85, 247, 0.25)",
                  background: "rgba(168,85,247,0.2)",
                  color: "#e6f0ff",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 8px 32px rgba(168,85,247,0.2)",
                  transition: "transform 0.15s ease, box-shadow 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(168,85,247,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(168,85,247,0.2)";
                }}
              >
                {showFormData ? "🔽" : "▶️"} Exoplanet Characteristics
              </button>

              <button
                type="button"
                onClick={() => setShowLightCurves(!showLightCurves)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "1px solid rgba(59, 130, 246, 0.25)",
                  background: "rgba(59,130,246,0.2)",
                  color: "#e6f0ff",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 8px 32px rgba(59,130,246,0.2)",
                  transition: "transform 0.15s ease, box-shadow 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(59,130,246,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(59,130,246,0.2)";
                }}
              >
                {showLightCurves ? "🔽" : "▶️"} 📊 Light Curves
              </button>

              <button
                type="button"
                onClick={() => setShowNotebook(!showNotebook)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "1px solid rgba(74, 222, 128, 0.25)",
                  background: "rgba(74,222,128,0.2)",
                  color: "#e6f0ff",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 8px 32px rgba(74,222,128,0.2)",
                  transition: "transform 0.15s ease, box-shadow 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,222,128,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(74,222,128,0.2)";
                }}
              >
                {showNotebook ? "🔽" : "▶️"} 🐍 JupyterLite Notebook
              </button>
            </div>

            {/* Collapsible Form Data */}
            {showFormData && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: 16,
                marginBottom: 20,
                animation: "fadeIn 0.3s ease-in-out"
            }}>
              {/* Mission & Host Star Data */}
              <div>
                <h3 style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 600, margin: "0 0 12px 0" }}>
                  Mission & Host Star Data
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <select
                    name="mission"
                    value={formData.mission}
                    onChange={handleSelectChange}
                    required
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  >
                    <option value="">Select Mission</option>
                    <option value="KEPLER">KEPLER</option>
                    <option value="K2">K2</option>
                    <option value="TESS">TESS</option>
                    <option value="NEW">NEW</option>
                  </select>
                  <input
                    type="text"
                    name="hostName"
                    value={formData.hostName}
                    onChange={handleInputChange}
                    placeholder="Host Star Name (e.g., Kepler-22)"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Orbital Data */}
              <div>
                <h3 style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 600, margin: "0 0 12px 0" }}>
                  Orbital Data
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input
                    type="number"
                    name="period"
                    value={formData.period}
                    onChange={handleInputChange}
                    placeholder="Orbital Period (days)"
                    step="0.01"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Transit Properties */}
              <div>
                <h3 style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 600, margin: "0 0 12px 0" }}>
                  Transit Properties
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Transit Duration (hours)"
                    step="0.01"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  />
                  <input
                    type="number"
                    name="depth"
                    value={formData.depth}
                    onChange={handleInputChange}
                    placeholder="Transit Depth (ppm)"
                    step="1"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Stellar Properties */}
              <div>
                <h3 style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 600, margin: "0 0 12px 0" }}>
                  Stellar Properties
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input
                    type="number"
                    name="st_teff"
                    value={formData.st_teff}
                    onChange={handleInputChange}
                    placeholder="Stellar Effective Temperature (K)"
                    step="1"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  />
                  <input
                    type="number"
                    name="st_logg"
                    value={formData.st_logg}
                    onChange={handleInputChange}
                    placeholder="Stellar logg (dex)"
                    step="0.01"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  />
                  <input
                    type="number"
                    name="st_rad"
                    value={formData.st_rad}
                    onChange={handleInputChange}
                    placeholder="Stellar Radius (R☉)"
                    step="0.01"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Photometric Data & Test */}
              <div>
                <h3 style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 600, margin: "0 0 12px 0" }}>
                  Photometric Data
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input
                    type="number"
                    name="mag"
                    value={formData.mag}
                    onChange={handleInputChange}
                    placeholder="Photometric Magnitude"
                    step="0.01"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  />
                    <button
                      type="button"
                      onClick={generateRandomData}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid rgba(74, 222, 128, 0.25)",
                        background: "rgba(74,222,128,0.2)",
                        color: "#e6f0ff",
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: "pointer",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        boxShadow: "0 8px 32px rgba(74,222,128,0.2)",
                      transition: "transform 0.15s ease, box-shadow 0.2s ease",
                      marginBottom: 8
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,222,128,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 8px 32px rgba(74,222,128,0.2)";
                      }}
                    >
                      🎲 Generate Random Test Data
                    </button>
                    
                    <button
                      type="button"
                      onClick={predictWithML}
                      disabled={loadingMlPrediction}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid rgba(236, 72, 153, 0.25)",
                        background: loadingMlPrediction ? "rgba(236,72,153,0.1)" : "rgba(236,72,153,0.2)",
                        color: "#e6f0ff",
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: loadingMlPrediction ? "not-allowed" : "pointer",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        boxShadow: "0 8px 32px rgba(236,72,153,0.2)",
                      transition: "transform 0.15s ease, box-shadow 0.2s ease",
                      opacity: loadingMlPrediction ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!loadingMlPrediction) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(236,72,153,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loadingMlPrediction) {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 8px 32px rgba(236,72,153,0.2)";
                        }
                      }}
                    >
                      {loadingMlPrediction ? "🤖 Predicting..." : "🤖 ML Prediction"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Light Curves Section */}
            {showLightCurves && (
              <div style={{ 
                marginTop: 20,
                animation: "fadeIn 0.3s ease-in-out"
              }}>
                <div style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(37,99,235,0.2))",
                  borderRadius: 12,
                  border: "1px solid rgba(59,130,246,0.25)",
                  padding: 16,
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)"
                }}>
                  <h3 style={{ 
                    color: "#e6f0ff", 
                    fontSize: 16, 
                    fontWeight: 600, 
                    margin: "0 0 8px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    📊 Observational Data & Light Curves
                  </h3>
                  
                  {/* Development Notice */}
                  <div style={{
                    background: "rgba(251,191,36,0.1)",
                    border: "1px solid rgba(251,191,36,0.3)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <span style={{ color: "#fbbf24", fontSize: 14 }}>🚧</span>
                    <div>
                      <div style={{ color: "#fbbf24", fontSize: 12, fontWeight: 600 }}>Under Development</div>
                      <div style={{ color: "#bcd2ff", fontSize: 11, opacity: 0.8 }}>This section is being enhanced with advanced visualization capabilities. Features and API integration to the ML model will be added (bugs remain to be fixed).</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr", 
                    gap: 12 
                  }}>
                    {/* Transit Data Upload */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <input
                        type="file"
                        accept=".csv,.txt,.dat,.fits"
                        onChange={(e) => handleFileChange(e, 'transit')}
                        style={{ display: "none" }}
                        id="transit-upload"
                      />
                      <label
                        htmlFor="transit-upload"
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          borderRadius: 8,
                          border: "1px solid rgba(188,210,255,0.15)",
                          background: "rgba(6,12,26,0.4)",
                          color: "#9bb8ff",
                          fontSize: 14,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          opacity: 1
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 20 }}>📊</span>
                          <div>
                            <div style={{ fontWeight: 600 }}>Transit Light Curves</div>
                            <div style={{ fontSize: 12, color: "#6b7280", opacity: 0.8 }}>
                              Upload .csv, .txt, .dat, or .fits files
                            </div>
                          </div>
                        </div>
                        <span style={{ 
                          color: "#10b981", 
                          fontSize: 12,
                          padding: "4px 8px",
                          background: "rgba(16,185,129,0.2)",
                          borderRadius: 4
                        }}>
                          Available
                        </span>
                      </label>
                      {transitData && (
                        <div style={{ 
                          color: "#4ade80", 
                          fontSize: 12, 
                          minWidth: "120px",
                          padding: "8px 12px",
                          background: "rgba(74,222,128,0.2)",
                          borderRadius: 6,
                          border: "1px solid rgba(74,222,128,0.3)"
                        }}>
                          ✓ {transitData.name.length > 15 ? transitData.name.substring(0, 15) + "..." : transitData.name}
                        </div>
                      )}
                    </div>

                    {/* JWST Image Upload */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'jwst')}
                        style={{ display: "none" }}
                        id="jwst-upload"
                        disabled
                      />
                      <label
                        htmlFor="jwst-upload"
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          borderRadius: 8,
                          border: "1px solid rgba(188,210,255,0.15)",
                          background: "rgba(6,12,26,0.4)",
                          color: "#9bb8ff",
                          fontSize: 14,
                          cursor: "not-allowed",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          opacity: 0.6
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 20 }}>🛰️</span>
                          <div>
                            <div style={{ fontWeight: 600 }}>JWST Infrared & Spectral Analysis</div>
                            <div style={{ fontSize: 12, color: "#6b7280", opacity: 0.8 }}>
                              Coming Soon - Advanced atmospheric analysis
                            </div>
                          </div>
                        </div>
                        <span style={{ 
                          color: "#6b7280", 
                          fontSize: 12,
                          padding: "4px 8px",
                          background: "rgba(107,114,128,0.2)",
                          borderRadius: 4
                        }}>
                          Not available
                        </span>
                      </label>
                      {jwstImage && (
                        <div style={{ 
                          color: "#4ade80", 
                          fontSize: 12, 
                          minWidth: "120px",
                          padding: "8px 12px",
                          background: "rgba(74,222,128,0.2)",
                          borderRadius: 6,
                          border: "1px solid rgba(74,222,128,0.3)"
                        }}>
                          ✓ {jwstImage.name.length > 15 ? jwstImage.name.substring(0, 15) + "..." : jwstImage.name}
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div style={{
                      background: "rgba(6,12,26,0.6)",
                      borderRadius: 8,
                      padding: 12,
                      border: "1px solid rgba(188,210,255,0.15)"
                    }}>
                      <div style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 8 }}>
                        📋 Supported Data Formats
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                        <div style={{ color: "#bcd2ff", fontSize: 11 }}>
                          • CSV: Time, Flux columns
                        </div>
                        <div style={{ color: "#bcd2ff", fontSize: 11 }}>
                          • FITS: Standard photometry
                        </div>
                        <div style={{ color: "#bcd2ff", fontSize: 11 }}>
                          • TXT/DAT: Space-separated values
                        </div>
                        <div style={{ color: "#bcd2ff", fontSize: 11 }}>
                          • JWST: Spectral data (future)
                        </div>
                      </div>
                    </div>

                    {/* Light Curve Simulation */}
                    <div style={{ marginTop: 16 }}>
                      <LightCurveSimulator 
                        onDataGenerated={handleLightCurveDataGenerated}
                        formData={formData}
                      />
                    </div>

                    {/* Light Curve Visualization */}
                    <div style={{ marginTop: 16 }}>
                      <LightCurveVisualizer 
                        lightCurveData={simulatedLightCurveData}
                        height={400}
                      />
                    </div>

                    {/* Python Notebook Section */}
                    <div style={{ marginTop: 12 }}>
                      <JupyterLiteNotebook 
                        height={600}
                        formData={formData}
                      />
                    </div>


                    {/* Manual Results Entry Section */}
                    <div style={{ marginTop: 20 }}>
                      <div style={{
                        background: "rgba(6,12,26,0.6)",
                        borderRadius: 8,
                        padding: 12,
                        border: "1px solid rgba(188,210,255,0.15)"
                      }}>
                        <h4 style={{ color: "#e6f0ff", fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                          🤖 Manual ML Results Entry
                        </h4>
                        
                        {/* Generate Random Data Button */}
                        <div style={{ marginBottom: 12, textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => {
                              // Fill manual ML results
                              setManualResults({
                                pred_label: "CONFIRMED",
                                confidence: "",
                                roc_auc: "0.7476",
                                accuracy: "0.6297",
                                precision_confirmed: "0.8723",
                                recall_confirmed: "0.4073",
                                f1_confirmed: "0.5553",
                                precision_candidate: "0.5422",
                                recall_candidate: "0.9217",
                                f1_candidate: "0.6828",
                                precision_false_positive: "0.7073",
                                recall_false_positive: "0.6645",
                                f1_false_positive: "0.6190"
                              });
                              
                              // Also fill required form data for Grace Hopper validation
                              setFormData({
                                mission: "KEPLER",
                                hostName: "Kepler-22",
                                period: "289.9",
                                duration: "12.5",
                                depth: "1500",
                                st_teff: "5528",
                                st_logg: "4.42",
                                st_rad: "0.97",
                                mag: "11.66"
                              });
                            }}
                            style={{
                              padding: "8px 16px",
                              borderRadius: 8,
                              border: "1px solid rgba(74, 222, 128, 0.25)",
                              background: "rgba(74,222,128,0.2)",
                              color: "#e6f0ff",
                              fontWeight: 600,
                              fontSize: 12,
                              cursor: "pointer",
                              backdropFilter: "blur(8px)",
                              WebkitBackdropFilter: "blur(8px)",
                              boxShadow: "0 8px 32px rgba(74,222,128,0.2)",
                              transition: "transform 0.15s ease, box-shadow 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,222,128,0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 8px 32px rgba(74,222,128,0.2)";
                            }}
                          >
                            🎲 Generate Test ML Results
                          </button>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 8 }}>
                          {/* Model Information */}
                          <div>
                            <label style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4, display: "block" }}>
                              Predicted Label
                            </label>
                            <select
                              name="pred_label"
                              value={manualResults.pred_label}
                              onChange={(e) => setManualResults(prev => ({ ...prev, pred_label: e.target.value }))}
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid rgba(188,210,255,0.25)",
                                background: "rgba(6,12,26,0.8)",
                                color: "#e6f0ff",
                                fontSize: 12
                              }}
                            >
                              <option value="">Select Classification</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="CANDIDATE">CANDIDATE</option>
                              <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
                            </select>
                          </div>


                          {/* Performance Metrics */}
                          <div>
                            <label style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4, display: "block" }}>
                              ROC-AUC Score
                            </label>
                            <input
                              type="number"
                              name="roc_auc"
                              placeholder="0.7476"
                              value={manualResults.roc_auc}
                              onChange={handleManualInputChange}
                              step="0.0001"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid rgba(188,210,255,0.25)",
                                background: "rgba(6,12,26,0.8)",
                                color: "#e6f0ff",
                                fontSize: 12
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4, display: "block" }}>
                              Accuracy
                            </label>
                            <input
                              type="number"
                              name="accuracy"
                              placeholder="0.6297"
                              value={manualResults.accuracy}
                              onChange={handleManualInputChange}
                              step="0.0001"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid rgba(188,210,255,0.25)",
                                background: "rgba(6,12,26,0.8)",
                                color: "#e6f0ff",
                                fontSize: 12
                              }}
                            />
                          </div>

                          {/* Precision, Recall, F1-Score for each class */}
                          <div>
                            <label style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4, display: "block" }}>
                              Precision CONFIRMED
                            </label>
                            <input
                              type="number"
                              name="precision_confirmed"
                              placeholder="0.8723"
                              value={manualResults.precision_confirmed}
                              onChange={handleManualInputChange}
                              step="0.0001"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid rgba(188,210,255,0.25)",
                                background: "rgba(6,12,26,0.8)",
                                color: "#e6f0ff",
                                fontSize: 12
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4, display: "block" }}>
                              Recall CONFIRMED
                            </label>
                            <input
                              type="number"
                              name="recall_confirmed"
                              placeholder="0.4073"
                              value={manualResults.recall_confirmed}
                              onChange={handleManualInputChange}
                              step="0.0001"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid rgba(188,210,255,0.25)",
                                background: "rgba(6,12,26,0.8)",
                                color: "#e6f0ff",
                                fontSize: 12
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4, display: "block" }}>
                              F1-Score CONFIRMED
                            </label>
                            <input
                              type="number"
                              name="f1_confirmed"
                              placeholder="0.5553"
                              value={manualResults.f1_confirmed}
                              onChange={handleManualInputChange}
                              step="0.0001"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid rgba(188,210,255,0.25)",
                                background: "rgba(6,12,26,0.8)",
                                color: "#e6f0ff",
                                fontSize: 12
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4, display: "block" }}>
                              Precision CANDIDATE
                            </label>
                            <input
                              type="number"
                              name="precision_candidate"
                              placeholder="0.5422"
                              value={manualResults.precision_candidate}
                              onChange={handleManualInputChange}
                              step="0.0001"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid rgba(188,210,255,0.25)",
                                background: "rgba(6,12,26,0.8)",
                                color: "#e6f0ff",
                                fontSize: 12
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4, display: "block" }}>
                              Recall CANDIDATE
                            </label>
                            <input
                              type="number"
                              name="recall_candidate"
                              placeholder="0.9217"
                              value={manualResults.recall_candidate}
                              onChange={handleManualInputChange}
                              step="0.0001"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid rgba(188,210,255,0.25)",
                                background: "rgba(6,12,26,0.8)",
                                color: "#e6f0ff",
                                fontSize: 12
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4, display: "block" }}>
                              F1-Score CANDIDATE
                            </label>
                            <input
                              type="number"
                              name="f1_candidate"
                              placeholder="0.6828"
                              value={manualResults.f1_candidate}
                              onChange={handleManualInputChange}
                              step="0.0001"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid rgba(188,210,255,0.25)",
                                background: "rgba(6,12,26,0.8)",
                                color: "#e6f0ff",
                                fontSize: 12
                              }}
                            />
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Model Card Section */}
                    <div style={{ marginTop: 16 }}>
                      <div style={{
                        background: "rgba(6,12,26,0.4)",
                        borderRadius: 8,
                        padding: 12,
                        border: "1px solid rgba(188,210,255,0.15)"
                      }}>
                        <h4 style={{ color: "#e6f0ff", fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                          📊 Model Card & Performance Metrics
                        </h4>
                        
                        <div style={{ 
                          background: "rgba(6,12,26,0.8)",
                          borderRadius: 6,
                          padding: 12,
                          border: "1px solid rgba(188,210,255,0.1)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ color: "#4ade80", fontSize: 16, marginRight: 8 }}>✅</span>
                            <span style={{ color: "#bcd2ff", fontSize: 12, fontWeight: 600 }}>Model Status</span>
                          </div>
                          <div style={{ color: "#e6f0ff", fontSize: 11, marginBottom: 12, padding: "8px 12px", background: "rgba(74,222,128,0.1)", borderRadius: 4 }}>
                            Modèle chargé depuis: /content/drive/MyDrive/models/naruto_KOI_best.keras
                          </div>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>ROC-AUC</div>
                              <div style={{ color: "#e6f0ff", fontSize: 16, fontWeight: 700 }}>0.7476</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>Accuracy</div>
                              <div style={{ color: "#e6f0ff", fontSize: 16, fontWeight: 700 }}>0.6297</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>F1-macro</div>
                              <div style={{ color: "#e6f0ff", fontSize: 16, fontWeight: 700 }}>0.6190</div>
                            </div>
                          </div>
                          
                          <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(6,12,26,0.6)", borderRadius: 4 }}>
                            <div style={{ color: "#9bb8ff", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Classification Report</div>
                            <div style={{ color: "#e6f0ff", fontSize: 10, fontFamily: "monospace", lineHeight: 1.4 }}>
                              <div style={{ marginBottom: 4 }}>precision    recall  f1-score   support</div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#4ade80" }}>0</span>
                                <span>0.8723    0.4073    0.5553       302</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#fbbf24" }}>1</span>
                                <span>0.5422    0.9217    0.6828       230</span>
                              </div>
                              <div style={{ borderTop: "1px solid rgba(188,210,255,0.2)", marginTop: 4, paddingTop: 4 }}>
                                <div>accuracy                         0.6297       532</div>
                                <div>macro avg     0.7073    0.6645    0.6190       532</div>
                                <div>weighted avg     0.7296    0.6297    0.6104       532</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ML Prediction Results */}
            {mlPrediction && (
              <div style={{ 
                marginTop: 20,
                animation: "fadeIn 0.3s ease-in-out"
              }}>
                <div style={{
                  background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.2))",
                  borderRadius: 12,
                  border: "1px solid rgba(236,72,153,0.25)",
                  padding: 16,
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)"
                }}>
                  <h3 style={{ 
                    color: "#e6f0ff", 
                    fontSize: 16, 
                    fontWeight: 600, 
                    margin: "0 0 16px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    🤖 ML Prediction Results
                  </h3>
                  
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                    gap: 12 
                  }}>
                    {/* Prediction Label */}
                    <div style={{
                      background: "rgba(6,12,26,0.8)",
                      borderRadius: 8,
                      padding: 12,
                      border: "1px solid rgba(188,210,255,0.15)"
                    }}>
                      <div style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 8 }}>
                        Predicted Classification
                      </div>
                      <div style={{ 
                        color: mlPrediction.pred_label === "CONFIRMED" ? "#4ade80" : 
                               mlPrediction.pred_label === "CANDIDATE" ? "#fbbf24" : "#ef4444",
                        fontSize: 16,
                        fontWeight: 700,
                        padding: "4px 8px",
                        borderRadius: 6,
                        background: mlPrediction.pred_label === "CONFIRMED" ? "rgba(74,222,128,0.2)" : 
                                  mlPrediction.pred_label === "CANDIDATE" ? "rgba(251,191,36,0.2)" : "rgba(239,68,68,0.2)",
                        border: `1px solid ${mlPrediction.pred_label === "CONFIRMED" ? "rgba(74,222,128,0.3)" : 
                                  mlPrediction.pred_label === "CANDIDATE" ? "rgba(251,191,36,0.3)" : "rgba(239,68,68,0.3)"}`,
                        textAlign: "center"
                      }}>
                        {mlPrediction.pred_label}
                      </div>
                    </div>

                    {/* Confidence Scores */}
                    <div style={{
                      background: "rgba(6,12,26,0.8)",
                      borderRadius: 8,
                      padding: 12,
                      border: "1px solid rgba(188,210,255,0.15)"
                    }}>
                      <div style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 8 }}>
                        Confidence Scores
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#4ade80", fontSize: 11 }}>CONFIRMED:</span>
                          <span style={{ color: "#e6f0ff", fontSize: 11 }}>{(mlPrediction.p_CONFIRMED * 100).toFixed(1)}%</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#fbbf24", fontSize: 11 }}>CANDIDATE:</span>
                          <span style={{ color: "#e6f0ff", fontSize: 11 }}>{(mlPrediction.p_CANDIDATE * 100).toFixed(1)}%</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#ef4444", fontSize: 11 }}>FALSE POSITIVE:</span>
                          <span style={{ color: "#e6f0ff", fontSize: 11 }}>{(mlPrediction.p_FALSE_POSITIVE * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                      background: "rgba(6,12,26,0.8)",
                      borderRadius: 8,
                      padding: 12,
                      border: "1px solid rgba(188,210,255,0.15)"
                    }}>
                      <div style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 8 }}>
                        Confidence Visualization
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ 
                            color: "#4ade80", 
                            fontSize: 10, 
                            minWidth: "60px",
                            fontWeight: 600
                          }}>CONFIRMED</div>
                          <div style={{ 
                            flex: 1, 
                            height: 8, 
                            background: "rgba(74,222,128,0.2)", 
                            borderRadius: 4,
                            overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${mlPrediction.p_CONFIRMED * 100}%`,
                              height: "100%",
                              background: "linear-gradient(90deg, rgba(74,222,128,0.8), rgba(74,222,128,1))",
                              transition: "width 0.3s ease"
                            }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ 
                            color: "#fbbf24", 
                            fontSize: 10, 
                            minWidth: "60px",
                            fontWeight: 600
                          }}>CANDIDATE</div>
                          <div style={{ 
                            flex: 1, 
                            height: 8, 
                            background: "rgba(251,191,36,0.2)", 
                            borderRadius: 4,
                            overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${mlPrediction.p_CANDIDATE * 100}%`,
                              height: "100%",
                              background: "linear-gradient(90deg, rgba(251,191,36,0.8), rgba(251,191,36,1))",
                              transition: "width 0.3s ease"
                            }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ 
                            color: "#ef4444", 
                            fontSize: 10, 
                            minWidth: "60px",
                            fontWeight: 600
                          }}>FALSE POSITIVE</div>
                          <div style={{ 
                            flex: 1, 
                            height: 8, 
                            background: "rgba(239,68,68,0.2)", 
                            borderRadius: 4,
                            overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${mlPrediction.p_FALSE_POSITIVE * 100}%`,

                              height: "100%",
                              background: "linear-gradient(90deg, rgba(239,68,68,0.8), rgba(239,68,68,1))",
                              transition: "width 0.3s ease"
                            }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div style={{
                    marginTop: 12,
                    padding: 8,
                    background: "rgba(6,12,26,0.6)",
                    borderRadius: 6,
                    border: "1px solid rgba(188,210,255,0.15)"
                  }}>
                    <div style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 4 }}>
                      🤖 AI Interpretation
                    </div>
                    <div style={{ color: "#bcd2ff", fontSize: 11 }}>
                      Based on machine learning analysis, this exoplanet shows characteristics {
                        mlPrediction.pred_label === "CONFIRMED" ? "consistent with confirmed exoplanet detection" :
                        mlPrediction.pred_label === "CANDIDATE" ? "suggesting potential exoplanet candidate requiring further validation" :
                        "that may indicate false positive detection"
                      }.
                    </div>
                  </div>

                  {/* ML Precision Details */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ color: "#9bb8ff", fontSize: 14, marginBottom: 12, fontWeight: 600, textAlign: "left" }}>
                      🔬 ML Precision Details
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
                      
                      {/* Model Architecture */}
                      <div style={{
                        background: "rgba(6,12,26,0.8)",
                        borderRadius: 8,
                        padding: 8,
                        border: "1px solid rgba(188,210,255,0.15)"
                      }}>
                        <div style={{ color: "#bcd2ff", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Model Architecture</div>
                        <div style={{ color: "#e6f0ff", fontSize: 10, marginBottom: 4 }}>HistGradientBoostingClassifier Pipeline</div>
                        <div style={{ color: "#bcd2ff", fontSize: 9 }}>
                          • QuantileTransformer normalization<br/>
                          • SimpleImputer for missing values<br/>
                          • Feature engineering (log transforms, ratios)
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div style={{
                        background: "rgba(6,12,26,0.8)",
                        borderRadius: 8,
                        padding: 8,
                        border: "1px solid rgba(188,210,255,0.15)"
                      }}>
                        <div style={{ color: "#bcd2ff", fontSize: 11, fontWeight: 600, marginBottom: 8, textAlign: "center" }}>Performance Metrics</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ color: "#4ade80", fontSize: 10, fontWeight: 600 }}>F1-macro</div>
                            <div style={{ color: "#e6f0ff", fontSize: 11 }}>0.831 ± 0.002</div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ color: "#4ade80", fontSize: 10, fontWeight: 600 }}>Balanced Acc</div>
                            <div style={{ color: "#e6f0ff", fontSize: 11 }}>0.834 ± 0.003</div>
                          </div>
                        </div>
                      </div>

                      {/* Training Data & Validation */}
                      <div style={{
                        background: "rgba(6,12,26,0.8)",
                        borderRadius: 8,
                        padding: 8,
                        border: "1px solid rgba(188,210,255,0.15)"
                      }}>
                        <div style={{ color: "#bcd2ff", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Training Data & Validation</div>
                        <div style={{ color: "#e6f0ff", fontSize: 9 }}>
                          Trained on NASA Exoplanet Archive (KOI + K2 + TOI missions). Validation: 5-Fold Stratified Group Cross-Validation with Leave-One-Mission-Out robustness testing across Kepler/K2/TESS missions.
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexDirection: "column", marginTop: 40 }}>
              
              <button
                type="submit"
                disabled={navigating}
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "1px solid rgba(168, 85, 247, 0.25)",
                  background: navigating ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.3)",
                  color: navigating ? "#bcd2ff" : "#e6f0ff",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: navigating ? "not-allowed" : "pointer",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 10px 40px rgba(168,85,247,0.25)",
                  transition: "transform 0.15s ease, box-shadow 0.2s ease",
                  opacity: navigating ? 0.8 : 1
                }}
                onMouseEnter={(e) => {
                  if (!navigating) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 18px 60px rgba(168,85,247,0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!navigating) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 40px rgba(168,85,247,0.25)";
                  }
                }}
              >
                {navigating ? "⏳ Navigating..." : 
                 (mlPrediction || Object.values(manualResults).some(v => v !== '')) ? "🚀 Launch Grace Hopper Analysis (with ML)" : 
                 "🚀 Launch Grace Hopper Analysis"}
              </button>
            </div>
          </form>
        </div>

        {/* Python Notebook Section - Outside the form */}
        {showNotebook && (
          <div style={{ 
            marginTop: 24,
            animation: "fadeIn 0.3s ease-in-out"
          }}>
            <div style={{ 
              background: "linear-gradient(135deg, rgba(20,30,60,0.6), rgba(6,12,26,0.8))",
              borderRadius: 16,
              border: "1px solid rgba(188,210,255,0.25)",
              padding: 24,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)"
            }}>
              <JupyterLiteNotebook 
                height={600}
                formData={formData}
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(1200px 600px at 50% 50%, rgba(140,170,255,0.06), rgba(0,0,0,0))" }} />
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
