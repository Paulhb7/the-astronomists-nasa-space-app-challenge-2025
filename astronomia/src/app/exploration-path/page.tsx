"use client";
import React from "react";
import { useRouter } from "next/navigation";
import StarfieldHyperdrive from "../components/StarfieldHyperdrive";
import NavigationBar from "../components/NavigationMenu";

export default function ExoplanetSearchPage() {
  const router = useRouter();


  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
      <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
      
      {/* Navigation Bar */}
      <NavigationBar pageTitle="Exoplanet Search" />
      

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
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 8,
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <div style={{
              fontSize: "1.2rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#8fb6ff",
              opacity: 0.9
            }}>The Astronomist</div>
            <div style={{
              fontSize: "1.2rem",
              letterSpacing: "0.1em",
              color: "#bcd2ff",
              opacity: 0.8
            }}>Choose your exploration path</div>
          </div>
        </div>

        {/* Main Options Layout */}
        <div style={{ 
          display: "flex",
          flexDirection: "column",
          gap: 32,
          marginBottom: 48
        }}>
            {/* Two Main Options */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: 32
            }}>
              {/* Johannes Kepler */}
          <div style={{
            background: "linear-gradient(135deg, rgba(20,30,60,0.6), rgba(6,12,26,0.8))",
            borderRadius: 20,
            border: "1px solid rgba(188,210,255,0.25)",
                padding: "16px 32px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,40,120,0.3)";
            e.currentTarget.style.borderColor = "rgba(188,210,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(188,210,255,0.25)";
          }}
          onClick={() => router.push('/kepler-input')}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🪐</div>
            <h2 style={{ 
              color: "#e6f0ff", 
              fontSize: 24, 
              fontWeight: 600, 
                  margin: "0 0 8px 0" 
            }}>
                  Johannes Kepler
            </h2>
                <p style={{ 
                  color: "#4ade80", 
                  fontSize: 12, 
                  margin: "0 0 16px 0",
                  fontWeight: 600,
                  opacity: 0.9
                }}>
                  Confirmed Exoplanets Analysis
                </p>
            <p style={{ 
              color: "#bcd2ff", 
              fontSize: 14, 
              margin: "0 0 20px 0",
              lineHeight: 1.5
            }}>
                  Search and explore confirmed exoplanets, analyze their characteristics and view detailed reports
            </p>
            <div style={{
              background: "rgba(188,210,255,0.1)",
              borderRadius: 8,
              padding: 12,
              fontSize: 12,
              color: "#bcd2ff"
            }}>
              Click to start searching
            </div>
          </div>

              {/* Grace Hopper */}
          <div style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,12,26,0.8))",
            borderRadius: 20,
                border: "1px solid rgba(168,85,247,0.3)",
                padding: "16px 32px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(168,85,247,0.2)";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              }}
              onClick={() => router.push('/grace-hopper-input')}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔭</div>
                <h2 style={{ 
                  color: "#e6f0ff", 
                  fontSize: 24, 
                  fontWeight: 600, 
                  margin: "0 0 8px 0" 
                }}>
                  Grace Hopper
                </h2>
                <p style={{ 
                  color: "#a855f7", 
                  fontSize: 12, 
                  margin: "0 0 16px 0",
                  fontWeight: 600,
                  opacity: 0.9
                }}>
                  New Exoplanet Analysis
                </p>
                <p style={{ 
                  color: "#bcd2ff", 
                  fontSize: 14, 
                  margin: "0 0 20px 0",
                  lineHeight: 1.5
                }}>
                  Advanced AI analysis for new exoplanet discoveries and research insights
                </p>
                <div style={{
                  background: "rgba(168,85,247,0.1)",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 12,
                  color: "#bcd2ff"
                }}>
                  Launch AI analysis
                </div>
              </div>
            </div>

            {/* Space Missions Option */}
            <div style={{
              background: "linear-gradient(135deg, rgba(74,222,128,0.1), rgba(6,12,26,0.8))",
              borderRadius: 20,
              border: "1px solid rgba(74,222,128,0.3)",
              padding: "12px 32px",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 20
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,222,128,0.2)";
            e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)";
          }}
          onClick={() => router.push('/mission-dashboard')}>
              <div style={{ fontSize: 40, flexShrink: 0 }}>🚀</div>
              <div style={{ flex: 1 }}>
            <h2 style={{ 
              color: "#e6f0ff", 
                  fontSize: 20, 
              fontWeight: 600, 
                  margin: "0 0 4px 0" 
            }}>
              Space Missions
            </h2>
            <p style={{ 
              color: "#bcd2ff", 
                  fontSize: 13, 
                  margin: "0 0 0 0",
                  lineHeight: 1.4
            }}>
              Explore NASA missions, view live data from space telescopes and discover new worlds
            </p>
              </div>
            <div style={{
              background: "rgba(74,222,128,0.1)",
              borderRadius: 8,
                padding: "8px 16px",
              fontSize: 12,
                color: "#bcd2ff",
                flexShrink: 0
            }}>
              Launch mission dashboard
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
