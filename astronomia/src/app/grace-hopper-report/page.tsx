"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StarfieldHyperdrive from "../components/StarfieldHyperdrive";

interface GraceHopperAnalysis {
  success: boolean;
  result?: string;
  error?: string;
  tools_used?: string[];
}

export default function GraceHopperReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [analysis, setAnalysis] = useState<GraceHopperAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract parameters from URL - focusing on observational data only
  
  // New form data
  const mission = searchParams.get('mission');
  const period = searchParams.get('period');
  const duration = searchParams.get('duration');
  const depth = searchParams.get('depth');
  const st_teff = searchParams.get('st_teff');
  const st_logg = searchParams.get('st_logg');
  const st_rad = searchParams.get('st_rad');
  const mag = searchParams.get('mag');
  
  // ML prediction data
  const mlPredictionParam = searchParams.get('ml_prediction');
  
  // Legacy parameters
  const distance = searchParams.get('distance');
  const stellarType = searchParams.get('stellarType');
  const orbitalPeriod = searchParams.get('orbitalPeriod');
  const semiMajorAxis = searchParams.get('semiMajorAxis');
  const planetRadius = searchParams.get('planetRadius');
  const planetMass = searchParams.get('planetMass');
  const equilibriumTemp = searchParams.get('equilibriumTemp');
  const discoveryMethod = searchParams.get('discoveryMethod');
  const discoveryYear = searchParams.get('discoveryYear');

  useEffect(() => {
    const performAnalysis = async () => {
      // Check if we have sufficient data for analysis (mission OR some observational parameters)
      const hasRequiredData = mission || period || depth || duration || st_teff;
      if (!hasRequiredData) {
        setError("Cannot perform analysis: Please provide at least mission information or some observational parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Prepare the characteristics object - include all available data
        const characteristics: any = {
          // Mission information (always required)
          mission: mission || "Unknown",
          
          // Essential observational data (include even if null for transparency)
          period: period ? parseFloat(period) : (orbitalPeriod ? parseFloat(orbitalPeriod) : null),
          duration: duration ? parseFloat(duration) : null,
          depth: depth ? parseFloat(depth) : null,
          
          // Stellar parameters
          st_teff: st_teff ? parseFloat(st_teff) : null,
          st_logg: st_logg ? parseFloat(st_logg) : null,
          st_rad: st_rad ? parseFloat(st_rad) : null,
          mag: mag ? parseFloat(mag) : null,
          
          // Additional stellar and orbital data
          distance: distance ? parseFloat(distance) : null,
          stellar_type: stellarType || null,
          orbital_period: orbitalPeriod ? parseFloat(orbitalPeriod) : null,
          semi_major_axis: semiMajorAxis ? parseFloat(semiMajorAxis) : null,
          
          // Planetary characteristics
          planet_radius: planetRadius ? parseFloat(planetRadius) : null,
          planet_mass: planetMass ? parseFloat(planetMass) : null,
          equilibrium_temp: equilibriumTemp ? parseFloat(equilibriumTemp) : null,
          
          // Discovery information
          discovery_method: discoveryMethod || null,
          discovery_year: discoveryYear ? parseInt(discoveryYear) : null
        };

        // Log the characteristics for debugging
        console.log("🔬 Grace Hopper Characteristics:", characteristics);
        console.log("📋 Mapping from frontend form fields:");
        console.log("  mission:", mission);
        console.log("  period:", period);
        console.log("  duration:", duration); 
        console.log("  depth:", depth);
        console.log("  st_teff:", st_teff);
        console.log("  st_logg:", st_logg);
        console.log("  st_rad:", st_rad);
        console.log("  mag:", mag);
        
        // Add ML prediction if available
        if (mlPredictionParam) {
          try {
            characteristics.ml_prediction = JSON.parse(decodeURIComponent(mlPredictionParam));
          } catch (e) {
            console.warn('Failed to parse ML prediction:', e);
          }
        }

        // Construct query with detailed context about available data
        const availableData = Object.keys(characteristics).filter(key => characteristics[key] !== null && characteristics[key] !== undefined).join(', ');
        const missingCriticalData = [];
        if (!characteristics.period && !characteristics.orbital_period) missingCriticalData.push('orbital period');
        if (!characteristics.depth) missingCriticalData.push('transit depth');
        if (!characteristics.duration) missingCriticalData.push('transit duration');
        
        let query = `\n🔬 EXOPLANET ANALYSIS REQUEST\n\n`;
        query += `Available data fields: ${availableData || 'None'}\n\n`;
        
        if (missingCriticalData.length > 0) {
          query += `⚠️ MISSING CRITICAL DATA: ${missingCriticalData.join(', ')}. Without these essential observational parameters, complete validation is challenging.\n\n`;
        }
        
        if (characteristics.ml_prediction) {
          const ml = characteristics.ml_prediction;
          query += `🤖 ML CLASSIFIER ANALYSIS:\n`;
          query += `• Predicted Status: ${ml.pred_label}\n`;
          query += `• Confidence Scores: CONFIRMED=${(ml.p_CONFIRMED*100).toFixed(1)}%, CANDIDATE=${(ml.p_CANDIDATE*100).toFixed(1)}%, FALSE_POSITIVE=${(ml.p_FALSE_POSITIVE*100).toFixed(1)}%\n\n`;
          query += `Request: Given the limited observational data, please provide your expert assessment on:\n`;
          query += `1) Is the ML classification ${ml.pred_label} (@ ${(Math.max(...Object.values(ml).filter(v => typeof v === 'number'))*100).toFixed(1)}% confidence) reasonable given available data?\n`;
          query += `2) What specific observational data would be needed to move from ${ml.pred_label} to a confirmed or false-positive status?\n`;
          query += `3) Provide a prioritized validation checklist with decision thresholds for this type of candidate.\n`;
        } else {
          query += `Request: Please analyze these observational data and provide:\n`;
          query += `1) Preliminary classification assessment (Candidate/Confirmed/False Positive)\n`;
          query += `2) List of specific follow-up observations needed for validation\n`;
          query += `3) Decision thresholds and diagnostic criteria\n`;
        }

        // Call the Grace Hopper API
        const payload = {
            characteristics: characteristics,
            query: query
        };
        
        console.log("📤 Sending to Grace Hopper API:");
        console.log("📤 Payload.characteristics:", payload.characteristics);
        console.log("📤 Payload.query:", payload.query.substring(0, 200) + "...");
        
        const response = await fetch('http://localhost:8000/grace-hopper/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Grace Hopper API Error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Grace Hopper API Response:", data);
      setAnalysis(data);
        
      } catch (err) {
        console.error('Error calling Grace Hopper API:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [mission, period, duration, depth, st_teff, st_logg, st_rad, mag, mlPredictionParam, distance, stellarType, orbitalPeriod, semiMajorAxis, planetRadius, planetMass, equilibriumTemp, discoveryMethod, discoveryYear]);

  const formatAnalysisText = (text: string) => {
    // Split text into lines and format
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Handle headers
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} style={{
            color: '#a855f7',
            fontSize: '18px',
            fontWeight: 700,
            margin: '24px 0 12px 0',
            borderBottom: '2px solid rgba(168,85,247,0.3)',
            paddingBottom: '8px'
          }}>
            {line.replace('## ', '')}
          </h2>
        );
      }
      
      // Handle bold text
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} style={{
            color: '#e6f0ff',
            fontSize: '16px',
            fontWeight: 600,
            margin: '12px 0'
          }}>
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      
      // Handle bullet points
      if (line.startsWith('- ')) {
        return (
          <div key={index} style={{
            color: '#bcd2ff',
            fontSize: '14px',
            margin: '8px 0',
            paddingLeft: '16px',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              left: '0',
              color: '#a855f7'
            }}>•</span>
            {line.replace('- ', '')}
          </div>
        );
      }
      
      // Handle regular text
      if (line.trim()) {
        return (
          <p key={index} style={{
            color: '#bcd2ff',
            fontSize: '14px',
            lineHeight: '1.6',
            margin: '8px 0'
          }}>
            {line}
          </p>
        );
      }
      
      // Handle empty lines
      return <br key={index} />;
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
        <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
        
        <div style={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          color: "#e6f0ff", 
          textAlign: "center",
          zIndex: 1
        }}>
          <h2 style={{ color: "#a855f7", marginBottom: "16px" }}>🔭 Grace Hopper Analysis</h2>
          
          {/* Spinning loader */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            margin: "16px 0"
          }}>
            <div style={{
              position: "relative",
              width: 50,
              height: 50
            }}>
              {/* Outer ring */}
              <div style={{
                position: "absolute",
                width: 50,
                height: 50,
                border: "3px solid rgba(168,85,247,0.2)",
                borderTop: "3px solid #a855f7",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
              {/* Inner ring */}
              <div style={{
                position: "absolute",
                top: 8,
                left: 8,
                width: 34,
                height: 34,
                border: "2px solid rgba(168,85,247,0.3)",
                borderBottom: "2px solid #c084fc",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite reverse"
              }} />
              {/* Center dot */}
              <div style={{
                position: "absolute",
                top: 22,
                left: 22,
                width: 6,
                height: 6,
                backgroundColor: "#a855f7",
                borderRadius: "50%",
                animation: "spin 0.5s linear infinite"
              }} />
            </div>
          </div>
          
          <p style={{ color: "#bcd2ff", fontSize: "16px", marginBottom: "8px" }}>
            Analyzing exoplanet characteristics and candidate data...
          </p>
          <p style={{ color: "#9bb8ff", fontSize: "14px", marginTop: "8px" }}>
            This may take a few moments
          </p>
        </div>
        
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(6,12,26,0.8);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(168,85,247,0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(168,85,247,0.5);
        }
      `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
        <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
        
        <div style={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          color: "#ff6b6b", 
          textAlign: "center",
          zIndex: 1
        }}>
          <h2 style={{ marginBottom: "16px" }}>❌ Analysis Error</h2>
          <p style={{ color: "#bcd2ff", marginBottom: "24px" }}>{error}</p>
          <button 
            onClick={() => router.push('/grace-hopper-input')}
            style={{
              background: "rgba(168,85,247,0.3)",
              color: "#e6f0ff",
              border: "1px solid rgba(168,85,247,0.25)",
              borderRadius: 10,
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Back to Input
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
      <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
      
      {/* Header */}
      <div style={{ 
        position: "absolute", 
        top: 24, 
        left: 24, 
        right: 24,
        zIndex: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ color: "#9bb8ff", letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12 }}>
          Grace Hopper - Exoplanet Analysis Report
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={() => router.push('/grace-hopper-input')}
            style={{
              background: "transparent",
              color: "#bcd2ff",
              border: "1px solid rgba(188,210,255,0.25)",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: 12
            }}
          >
            ← New Analysis
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        position: "absolute", 
        top: 80, 
        left: "50%", 
        transform: "translateX(-50%)", 
        zIndex: 1,
        width: "95vw",
        maxWidth: 1000,
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(168,85,247,0.3) rgba(6,12,26,0.8)"
      }}>
        {/* Report Header */}
        <div style={{ 
          background: "linear-gradient(135deg, rgba(20,30,60,0.6), rgba(6,12,26,0.8))",
            borderRadius: 16,
            border: "1px solid rgba(168,85,247,0.3)",
            padding: 24,
          marginBottom: 24,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)"
          }}>
            <h1 style={{ 
              color: "#e6f0ff", 
              fontSize: 28, 
              fontWeight: 700, 
              margin: "0 0 8px 0",
              textShadow: "0 0 20px rgba(168,85,247,0.3)"
            }}>
              🔭 Grace Hopper Analysis Report
            </h1>
          <p style={{ 
            color: "#a855f7", 
            fontSize: 16, 
            margin: "0 0 16px 0",
            fontWeight: 600
          }}>
            Exoplanet Analysis Report
          </p>
          
          {analysis?.tools_used && (
            <div style={{ 
              color: "#9bb8ff", 
              fontSize: 12, 
              marginTop: 16,
              padding: "8px 12px",
              background: "rgba(168,85,247,0.1)", 
              borderRadius: 8, 
              border: "1px solid rgba(168,85,247,0.2)"
            }}>
              <strong>Analysis Tools:</strong> {analysis.tools_used.join(', ')}
            </div>
          )}
        </div>

        {/* Analysis Content */}
        {analysis?.result && (
          <div style={{ 
            background: "linear-gradient(135deg, rgba(20,30,60,0.6), rgba(6,12,26,0.8))",
            borderRadius: 16,
            border: "1px solid rgba(188,210,255,0.25)",
            padding: 24,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            marginBottom: 24
          }}>
            {formatAnalysisText(analysis.result)}
          </div>
        )}


        {/* Footer */}
        <div style={{ 
          textAlign: "center", 
          marginTop: 32, 
          padding: "16px 0",
          color: "#9bb8ff",
          fontSize: 12
        }}>
          <p>Grace Hopper AI Analysis System • Powered by Advanced Astrophysics Research</p>
        </div>
      </div>

      {/* Background gradient */}
      <div style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: 0, 
        pointerEvents: "none", 
        background: "radial-gradient(1200px 600px at 50% 50%, rgba(168,85,247,0.06), rgba(0,0,0,0))" 
      }} />
      
      <style jsx global>{`
        /* Custom scrollbar styling for the entire page */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(6,12,26,0.8);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(168,85,247,0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(168,85,247,0.5);
        }
      `}</style>
    </div>
  );
}