"use client";
import React, { useState } from "react";
import StarfieldHyperdrive from "./components/StarfieldHyperdrive";
import PlanetViewer, { Exoplanet } from "./components/PlanetViewer";

export default function Home() {
  const [activePlanet, setActivePlanet] = useState<Exoplanet | null>(null);
  const [showPanel, setShowPanel] = useState(false);



  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
      <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
      
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
          flexDirection: "column",
        height: "100vh",
          textAlign: "center",
        color: "#e6f0ff",
        padding: "0 24px"
      }}>
        <div style={{
          fontSize: "0.9rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "#8fb6ff",
          opacity: 0.9,
          marginBottom: 8
        }}>The Astronomists</div>
        <h1 style={{
          fontSize: "clamp(42px, 6vw, 88px)",
          lineHeight: 1.05,
          margin: 0,
          background: "linear-gradient(180deg, #eef6ff, #9fc5ff)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 8px 50px rgba(159,197,255,0.2)"
        }}>
          NASA AI Agents<br/>for Exoplanets hunting
        </h1>
        <p style={{
          maxWidth: 720,
          margin: "16px auto 28px",
          color: "#bcd2ff",
          fontSize: "clamp(16px, 2.2vw, 20px)",
          lineHeight: 1.6
        }}>
          Introducing Agentic Machine learning intelligence to classify exoplanets.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href="/exploration-path"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid rgba(188, 210, 255, 0.25)",
              background: "rgba(20,30,60,0.55)",
              color: "#e6f0ff",
              textDecoration: "none",
              fontWeight: 600,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 10px 40px rgba(0,40,120,0.25)",
              transition: "transform 0.15s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 18px 60px rgba(0,40,120,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,40,120,0.25)";
            }}
          >
            Engage Warp
          </a>
          <a
            href="/learn-more"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid rgba(188, 210, 255, 0.25)",
              background: "rgba(8,14,28,0.5)",
              color: "#bcd2ff",
              textDecoration: "none",
              fontWeight: 600,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transition: "transform 0.15s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(188,210,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Learn More
          </a>
        </div>
          </div>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(1200px 600px at 50% 50%, rgba(140,170,255,0.06), rgba(0,0,0,0))" }} />

      {activePlanet && (
          <div style={{
          position: "fixed",
          left: 24,
          bottom: 24,
            zIndex: 2,
          borderRadius: 20,
          border: "1px solid rgba(188,210,255,0.25)",
          background: "linear-gradient(180deg, rgba(10,18,38,0.75), rgba(10,18,38,0.55))",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          padding: 16
        }}>
          <PlanetViewer planet={activePlanet} size={420} />
          </div>
      )}

      {/* Slide-in chat panel */}
          <div style={{ 
        position: "fixed",
              top: 0,
              right: 0,
        height: "100vh",
        width: showPanel ? 420 : 0,
        overflow: "hidden",
        transition: "width 260ms ease",
        zIndex: 3,
        background: "linear-gradient(180deg, rgba(6,12,26,0.9), rgba(6,12,26,0.75))",
        borderLeft: showPanel ? "1px solid rgba(188,210,255,0.25)" : "none",
        boxShadow: showPanel ? "-20px 0 80px rgba(0,0,0,0.45)" : "none",
        backdropFilter: showPanel ? "blur(10px)" : undefined as any,
        WebkitBackdropFilter: showPanel ? "blur(10px)" : undefined as any
      }}>
        {showPanel && activePlanet && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(188,210,255,0.18)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, color: "#e6f0ff" }}>{activePlanet.name}</div>
              <button onClick={() => setShowPanel(false)} style={{ background: "transparent", color: "#bcd2ff", border: "1px solid rgba(188,210,255,0.25)", borderRadius: 10, padding: "6px 10px", cursor: "pointer" }}>Close</button>
              </div>
            <div style={{ padding: 16, color: "#cfe0ff", fontSize: 14, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 10, opacity: 0.9 }}>{activePlanet.description}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                <li><strong>Host star</strong>: {activePlanet.hostStar}</li>
                {activePlanet.orbitalPeriodDays && <li><strong>Orbital period</strong>: {activePlanet.orbitalPeriodDays} days</li>}
                {activePlanet.semiMajorAxisAU && <li><strong>Semi-major axis</strong>: {activePlanet.semiMajorAxisAU} AU</li>}
                <li><strong>Radius</strong>: {activePlanet.radiusEarth} R⊕</li>
                {activePlanet.massEarth && <li><strong>Mass</strong>: {activePlanet.massEarth} M⊕</li>}
                {activePlanet.equilibriumTempK && <li><strong>Equilibrium temperature</strong>: {activePlanet.equilibriumTempK} K</li>}
                {activePlanet.discoveryMethod && <li><strong>Discovery method</strong>: {activePlanet.discoveryMethod}</li>}
              </ul>
            </div>
            <div style={{ marginTop: "auto", padding: 12, borderTop: "1px solid rgba(188,210,255,0.18)", display: "flex", gap: 8 }}>
              <input placeholder="Ask about this planet..." style={{ flex: 1, background: "rgba(188,210,255,0.08)", color: "#e6f0ff", border: "1px solid rgba(188,210,255,0.2)", borderRadius: 10, padding: "10px 12px", outline: "none" }} />
              <button style={{ background: "rgba(140,170,255,0.2)", color: "#e6f0ff", border: "1px solid rgba(188,210,255,0.25)", borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 600 }}>Send</button>
            </div>
          </div>
        )}
        </div>
    </div>
  );
}


