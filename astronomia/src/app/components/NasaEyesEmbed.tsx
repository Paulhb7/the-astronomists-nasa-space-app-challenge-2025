"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";

export default function NasaEyesEmbed({
  targetName,
  height = 600,
  full = false,
}: {
  targetName: string;
  height?: number;
  full?: boolean;
}) {
  const [iframeError, setIframeError] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { generalUrl, planetUrl } = useMemo(() => {
    // Convert target name to NASA Eyes format for direct planet access
    let formattedName = targetName.trim();
    
    // Handle different planet naming conventions
    if (formattedName.includes('HD ')) {
      // HD planets: "HD 189733 b" -> "HD_189733_b"
      formattedName = formattedName.replace(/\s+/g, '_');
    } else if (formattedName.includes('Kepler')) {
      // Kepler planets: "Kepler-22b" -> "Kepler-22_b" (add underscore before letter)
      formattedName = formattedName.replace(/\s+/g, '');
      formattedName = formattedName.replace(/(\d+)([a-z])/i, '$1_$2');
    } else if (formattedName.includes('TRAPPIST')) {
      // TRAPPIST planets: "TRAPPIST-1e" -> "TRAPPIST-1_e" (add underscore before letter)
      formattedName = formattedName.replace(/\s+/g, '');
      formattedName = formattedName.replace(/(\d+)([a-z])/i, '$1_$2');
    } else if (formattedName.includes('K2-')) {
      // K2 planets: "K2-18b" -> "K2-18_b" (add underscore before letter)
      formattedName = formattedName.replace(/\s+/g, '');
      formattedName = formattedName.replace(/(\d+)([a-z])/i, '$1_$2');
    } else {
      // Default: replace spaces with underscores, keep other characters
      formattedName = formattedName.replace(/\s+/g, '_');
    }
    
    // Start from the main view with Milky Way
    const generalUrl = 'https://eyes.nasa.gov/apps/exo/#/';
    const planetUrl = `https://eyes.nasa.gov/apps/exo/#/planet/${formattedName}`;
    
    console.log(`NASA Eyes - General URL: ${generalUrl}`);
    console.log(`NASA Eyes - Direct planet URL for "${targetName}": ${planetUrl}`);
    
    return { generalUrl, planetUrl };
  }, [targetName]);

  // Navigate to general view first, then to planet after 10 seconds
  useEffect(() => {
    if (iframeRef.current) {
      // Start with general view
      iframeRef.current.src = generalUrl;
      
      // Hide initial loading message after 2 seconds
      setTimeout(() => setShowMessage(false), 2000);
      
      // Navigate to planet view after 10 seconds
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = planetUrl;
        }
      }, 10000);
    }
  }, [generalUrl, planetUrl]);

  return (
    <div style={{
      width: full ? "100%" : "min(900px, 60vw)",
      height: full ? "100%" : height,
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(188,210,255,0.25)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
      background: "#000",
      position: "relative"
    }}>
      {!iframeError ? (
        <>
          <iframe
            ref={iframeRef}
            src={planetUrl}
            title={`NASA Eyes on Exoplanets - ${targetName}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            } as React.CSSProperties}
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onError={() => setIframeError(true)}
          />
          {/* Auto-navigation message */}
          {showMessage && (
            <div style={{
              position: "absolute",
              top: 16,
              left: 16,
              right: 16,
              background: "linear-gradient(180deg, rgba(6,12,26,0.9), rgba(6,12,26,0.7))",
              border: "1px solid rgba(188,210,255,0.25)",
              borderRadius: 12,
              padding: 16,
              color: "#e6f0ff",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              zIndex: 10,
              opacity: showMessage ? 1 : 0,
              transition: "opacity 0.5s ease-out"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <h4 style={{ margin: 0, color: "#9bb8ff", fontSize: 14, fontWeight: 600 }}>
                  🪐 Loading {targetName}...
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.8, lineHeight: 1.4 }}>
                Starting from overview view, automatically switching to <strong>{targetName}</strong> in 10 seconds.
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          background: "linear-gradient(180deg, rgba(6,12,26,0.9), rgba(6,12,26,0.75))",
          color: "#e6f0ff"
        }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#9bb8ff" }}>Planet Not Found in NASA Eyes</h3>
          <p style={{ margin: "0 0 20px 0", textAlign: "center", opacity: 0.8 }}>
            The exoplanet "{targetName}" might not be available in NASA Eyes on Exoplanets, 
            or the name format might need adjustment.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => setIframeError(false)}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid rgba(188,210,255,0.25)",
                background: "rgba(140,170,255,0.22)",
                color: "#e6f0ff",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Try Again
            </button>
          </div>
          <p style={{ margin: "16px 0 0 0", fontSize: 12, opacity: 0.6, textAlign: "center" }}>
            General URL: {generalUrl}<br/>
            Direct planet URL: {planetUrl}
          </p>
        </div>
      )}
    </div>
  );
}
