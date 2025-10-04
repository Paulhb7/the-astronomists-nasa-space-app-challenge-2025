"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StarfieldHyperdrive from "../components/StarfieldHyperdrive";
import NavigationBar from "../components/NavigationMenu";

export default function JohannesKeplerPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/kepler-planet-results?planet=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
      <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
      
      {/* Navigation Bar */}
      <NavigationBar pageTitle="Johannes Kepler - Exoplanet Search" />
      
      {/* Main Content Section */}
      <div style={{ 
        position: "absolute", 
        top: "50%",
        marginTop: 40, 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        zIndex: 1,
        width: "90vw",
        maxWidth: 800,
        textAlign: "center"
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <div style={{
              fontSize: "1rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#8fb6ff",
              opacity: 0.9
            }}>The Astronomist</div>
            <div style={{
              fontSize: "0.9rem",
              letterSpacing: "0.05em",
              color: "#bcd2ff",
              opacity: 0.8
            }}>Johannes Kepler - Exoplanet Search</div>
          </div>
        </div>

        {/* Search Section */}
        <div style={{ 
          background: "linear-gradient(135deg, rgba(20,30,60,0.6), rgba(6,12,26,0.8))",
          borderRadius: 20,
          border: "1px solid rgba(188,210,255,0.25)",
          padding: 32,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          animation: "fadeIn 0.3s ease-in"
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🪐</div>
            <h3 style={{ 
              color: "#e6f0ff", 
              fontSize: 20, 
              fontWeight: 600, 
              margin: "0 0 6px 0" 
            }}>
              Johannes Kepler
            </h3>
            <p style={{ 
              color: "#4ade80", 
              fontSize: 12, 
              margin: "0 0 12px 0",
              fontWeight: 600,
              opacity: 0.9
            }}>
              Confirmed Exoplanets Analysis
            </p>
            <p style={{ 
              color: "#bcd2ff", 
              fontSize: 12, 
              margin: "0 0 16px 0",
              lineHeight: 1.4
            }}>
              Search and explore confirmed exoplanets, analyze their characteristics and view detailed reports
            </p>
          </div>
          
          <h4 style={{ 
            color: "#e6f0ff", 
            fontSize: 16, 
            fontWeight: 600, 
            margin: "0 0 16px 0" 
          }}>
            🔍 Search for an Exoplanet
          </h4>
          
          <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
            <div style={{ 
              display: "flex", 
              gap: 10, 
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter exoplanet name (e.g., Kepler-22b, TRAPPIST-1e)"
                style={{
                  flex: 1,
                  minWidth: 250,
                  maxWidth: 350,
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(188,210,255,0.25)",
                  background: "rgba(6,12,26,0.8)",
                  color: "#e6f0ff",
                  fontSize: 14,
                  outline: "none",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(188,210,255,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(188,210,255,0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(188,210,255,0.25)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "1px solid rgba(188, 210, 255, 0.25)",
                  background: "rgba(20,30,60,0.55)",
                  color: "#e6f0ff",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 10px 40px rgba(0,40,120,0.25)",
                  transition: "transform 0.15s ease, box-shadow 0.2s ease",
                  whiteSpace: "nowrap"
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
                🔍 Search Exoplanet
              </button>
            </div>
          </form>
          
          {/* Quick search buttons */}
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {[
                "Kepler-22 b",
                "TRAPPIST-1e",
                "Kepler-452b",
                "K2-18b",
                "Proxima Centauri b",
                "Gliese 581g"
              ].map((planetName) => (
                <button
                  key={planetName}
                  onClick={() => {
                    setQuery(planetName);
                    router.push(`/kepler-planet-results?planet=${encodeURIComponent(planetName)}`);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid rgba(188,210,255,0.25)",
                    background: "rgba(188,210,255,0.08)",
                    color: "#bcd2ff",
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(140,170,255,0.22)";
                    e.currentTarget.style.color = "#e6f0ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(188,210,255,0.08)";
                    e.currentTarget.style.color = "#bcd2ff";
                  }}
                >
                  {planetName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(1200px 600px at 50% 50%, rgba(140,170,255,0.06), rgba(0,0,0,0))" }} />
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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
