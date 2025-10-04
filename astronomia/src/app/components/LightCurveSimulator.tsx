"use client";
import React, { useState, useCallback } from 'react';

export interface LightCurveData {
  time: number[];
  flux: number[];
  fluxError: number[];
  metadata: {
    period: number;
    duration: number;
    depth: number;
    noiseLevel: number;
    transitCount: number;
    starName: string;
  };
}

interface LightCurveSimulatorProps {
  onDataGenerated: (data: LightCurveData) => void;
  formData?: {
    period?: string;
    duration?: string;
    depth?: string;
    hostName?: string;
  };
}

const LightCurveSimulator: React.FC<LightCurveSimulatorProps> = ({ 
  onDataGenerated, 
  formData 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [simulationParams, setSimulationParams] = useState({
    period: formData?.period ? parseFloat(formData.period) : 10.0,
    duration: formData?.duration ? parseFloat(formData.duration) : 2.0,
    depth: formData?.depth ? parseFloat(formData.depth) : 1000,
    noiseLevel: 0.01,
    transitCount: 3,
    starName: formData?.hostName || 'Simulated Star'
  });

  const generateTransitLightCurve = useCallback((
    time: number[],
    period: number,
    duration: number,
    depth: number,
    noiseLevel: number
  ): { flux: number[], fluxError: number[] } => {
    const flux: number[] = [];
    const fluxError: number[] = [];
    
    // Calculate transit parameters
    const transitDuration = duration / 24; // Convert hours to days
    const ingressTime = transitDuration * 0.1; // 10% of duration for ingress/egress
    const flatTime = transitDuration * 0.8; // 80% flat bottom
    
    for (let i = 0; i < time.length; i++) {
      const t = time[i];
      
      // Calculate phase (0 to 1)
      const phase = (t % period) / period;
      
      // Determine if we're in transit
      const transitCenter = 0.5; // Transit at phase 0.5
      const transitStart = transitCenter - transitDuration / 2;
      const transitEnd = transitCenter + transitDuration / 2;
      
      let fluxValue = 1.0; // Normalized flux
      
      if (phase >= transitStart && phase <= transitEnd) {
        // We're in the transit region
        const relativePhase = (phase - transitStart) / transitDuration;
        
        if (relativePhase <= ingressTime / transitDuration) {
          // Ingress
          const ingressProgress = relativePhase / (ingressTime / transitDuration);
          fluxValue = 1.0 - (depth / 10000) * ingressProgress;
        } else if (relativePhase >= 1 - (ingressTime / transitDuration)) {
          // Egress
          const egressProgress = (relativePhase - (1 - ingressTime / transitDuration)) / (ingressTime / transitDuration);
          fluxValue = 1.0 - (depth / 10000) * (1 - egressProgress);
        } else {
          // Flat bottom
          fluxValue = 1.0 - (depth / 10000);
        }
      }
      
      // Add noise
      const noise = (Math.random() - 0.5) * noiseLevel;
      fluxValue += noise;
      
      // Add systematic variations (stellar variability)
      const stellarVariation = 0.001 * Math.sin(2 * Math.PI * t / 0.5); // 0.5 day period
      fluxValue += stellarVariation;
      
      flux.push(Math.max(0.95, Math.min(1.05, fluxValue))); // Clamp values
      fluxError.push(noiseLevel * 0.5); // Error bars
    }
    
    return { flux, fluxError };
  }, []);

  const generateLightCurveData = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { period, duration, depth, noiseLevel, transitCount, starName } = simulationParams;
      
      // Generate time array
      const totalDuration = period * transitCount;
      const timeStep = 0.01; // 0.01 days = ~14 minutes
      const time: number[] = [];
      
      for (let t = 0; t <= totalDuration; t += timeStep) {
        time.push(t);
      }
      
      // Generate light curve
      const { flux, fluxError } = generateTransitLightCurve(
        time, period, duration, depth, noiseLevel
      );
      
      const lightCurveData: LightCurveData = {
        time,
        flux,
        fluxError,
        metadata: {
          period,
          duration,
          depth,
          noiseLevel,
          transitCount,
          starName
        }
      };
      
      onDataGenerated(lightCurveData);
      
    } catch (error) {
      console.error('Error generating light curve:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [simulationParams, generateTransitLightCurve, onDataGenerated]);

  const handleParamChange = (param: string, value: number) => {
    setSimulationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  return (
    <div style={{
      background: "rgba(6,12,26,0.6)",
      borderRadius: 12,
      border: "1px solid rgba(59,130,246,0.25)",
      padding: 16,
      marginBottom: 16
    }}>
      <h4 style={{ 
        color: "#e6f0ff", 
        fontSize: 16, 
        fontWeight: 600, 
        margin: "0 0 12px 0",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        🎲 Light Curve Simulation Parameters
      </h4>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: 12,
        marginBottom: 16
      }}>
        {/* Period */}
        <div>
          <label style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 4, display: "block" }}>
            Orbital Period (days)
          </label>
          <input
            type="number"
            value={simulationParams.period}
            onChange={(e) => handleParamChange('period', parseFloat(e.target.value) || 10)}
            step="0.1"
            min="0.5"
            max="1000"
            style={{
              width: "100%",
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

        {/* Duration */}
        <div>
          <label style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 4, display: "block" }}>
            Transit Duration (hours)
          </label>
          <input
            type="number"
            value={simulationParams.duration}
            onChange={(e) => handleParamChange('duration', parseFloat(e.target.value) || 2)}
            step="0.1"
            min="0.5"
            max="24"
            style={{
              width: "100%",
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

        {/* Depth */}
        <div>
          <label style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 4, display: "block" }}>
            Transit Depth (ppm)
          </label>
          <input
            type="number"
            value={simulationParams.depth}
            onChange={(e) => handleParamChange('depth', parseFloat(e.target.value) || 1000)}
            step="100"
            min="100"
            max="50000"
            style={{
              width: "100%",
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

        {/* Noise Level */}
        <div>
          <label style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 4, display: "block" }}>
            Noise Level
          </label>
          <input
            type="number"
            value={simulationParams.noiseLevel}
            onChange={(e) => handleParamChange('noiseLevel', parseFloat(e.target.value) || 0.01)}
            step="0.001"
            min="0.001"
            max="0.1"
            style={{
              width: "100%",
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

        {/* Transit Count */}
        <div>
          <label style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 4, display: "block" }}>
            Number of Transits
          </label>
          <input
            type="number"
            value={simulationParams.transitCount}
            onChange={(e) => handleParamChange('transitCount', parseInt(e.target.value) || 3)}
            step="1"
            min="1"
            max="10"
            style={{
              width: "100%",
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

        {/* Star Name */}
        <div>
          <label style={{ color: "#9bb8ff", fontSize: 12, marginBottom: 4, display: "block" }}>
            Star Name
          </label>
          <input
            type="text"
            value={simulationParams.starName}
            onChange={(e) => setSimulationParams(prev => ({ ...prev, starName: e.target.value }))}
            style={{
              width: "100%",
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

      {/* Generate Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={generateLightCurveData}
          disabled={isGenerating}
          style={{
            padding: "12px 24px",
            borderRadius: 10,
            border: "1px solid rgba(59,130,246,0.25)",
            background: isGenerating ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.3)",
            color: isGenerating ? "#bcd2ff" : "#e6f0ff",
            fontWeight: 600,
            fontSize: 14,
            cursor: isGenerating ? "not-allowed" : "pointer",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(59,130,246,0.2)",
            transition: "transform 0.15s ease, box-shadow 0.2s ease",
            opacity: isGenerating ? 0.8 : 1
          }}
          onMouseEnter={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(59,130,246,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(59,130,246,0.2)";
            }
          }}
        >
          {isGenerating ? "🔄 Generating..." : "🎲 Generate Simulated Light Curve"}
        </button>
      </div>

      {/* Info */}
      <div style={{
        marginTop: 12,
        padding: "8px 12px",
        background: "rgba(6,12,26,0.4)",
        borderRadius: 6,
        border: "1px solid rgba(188,210,255,0.15)"
      }}>
        <div style={{ color: "#9bb8ff", fontSize: 11, marginBottom: 4 }}>
          ℹ️ Simulation Info
        </div>
        <div style={{ color: "#bcd2ff", fontSize: 10, lineHeight: 1.4 }}>
          • Generates realistic transit light curves with ingress/egress phases<br/>
          • Includes stellar variability and photometric noise<br/>
          • Parameters can be adjusted to match real exoplanet observations<br/>
          • Data format compatible with Kepler, TESS, and other missions
        </div>
      </div>
    </div>
  );
};

export default LightCurveSimulator;
