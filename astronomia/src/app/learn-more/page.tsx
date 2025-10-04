"use client";
import React from "react";
import { useRouter } from "next/navigation";
import StarfieldHyperdrive from "../components/StarfieldHyperdrive";

export default function LearnMorePage() {
  const router = useRouter();

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
          Learn More
        </div>
        <button 
          onClick={() => router.back()}
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
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div style={{ 
        position: "absolute", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        zIndex: 1,
        width: "90vw",
        maxWidth: 800,
        textAlign: "center"
      }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ 
            color: "#e6f0ff", 
            fontSize: 36, 
            fontWeight: 700, 
            margin: "0 0 16px 0",
            textShadow: "0 0 20px rgba(140,170,255,0.3)"
          }}>
            🚀 The Astronomist
          </h1>
          <p style={{ 
            color: "#bcd2ff", 
            fontSize: 18, 
            margin: 0,
            lineHeight: 1.6
          }}>
            Découvrez notre démarche d'exploration spatiale
          </p>
        </div>

        {/* Content Card */}
        <div style={{ 
          background: "linear-gradient(135deg, rgba(20,30,60,0.6), rgba(6,12,26,0.8))",
          borderRadius: 20,
          border: "1px solid rgba(188,210,255,0.25)",
          padding: 40,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          textAlign: "left"
        }}>
          <h2 style={{ 
            color: "#e6f0ff", 
            fontSize: 24, 
            fontWeight: 600, 
            margin: "0 0 24px 0",
            textAlign: "center"
          }}>
            🌌 Notre Mission
          </h2>
          
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ 
              color: "#4ade80", 
              fontSize: 18, 
              fontWeight: 600, 
              margin: "0 0 12px 0" 
            }}>
              🔍 Exploration des Exoplanètes
            </h3>
            <p style={{ 
              color: "#bcd2ff", 
              fontSize: 14, 
              lineHeight: 1.6,
              margin: 0
            }}>
              The Astronomist vous permet d'explorer l'univers des exoplanètes en temps réel. 
              Utilisez nos outils de recherche avancés pour découvrir des mondes lointains, 
              analyser leurs caractéristiques et comprendre leur potentiel d'habitabilité.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ 
              color: "#4ade80", 
              fontSize: 18, 
              fontWeight: 600, 
              margin: "0 0 12px 0" 
            }}>
              🛰️ Missions Spatiales
            </h3>
            <p style={{ 
              color: "#bcd2ff", 
              fontSize: 14, 
              lineHeight: 1.6,
              margin: 0
            }}>
              Suivez les missions spatiales les plus importantes de la NASA : TESS, JWST, Kepler, 
              Spitzer et Hubble. Chaque mission apporte sa contribution unique à notre compréhension 
              de l'univers et des exoplanètes.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ 
              color: "#4ade80", 
              fontSize: 18, 
              fontWeight: 600, 
              margin: "0 0 12px 0" 
            }}>
              🎯 Notre Approche
            </h3>
            <p style={{ 
              color: "#bcd2ff", 
              fontSize: 14, 
              lineHeight: 1.6,
              margin: 0
            }}>
              Nous combinons les données les plus récentes de la NASA avec des outils d'analyse 
              avancés pour vous offrir une expérience d'exploration spatiale immersive et éducative. 
              Chaque découverte est une fenêtre sur l'infini.
            </p>
          </div>

          {/* Features Grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: 16,
            marginBottom: 32
          }}>
            <div style={{
              background: "rgba(74,222,128,0.1)",
              borderRadius: 12,
              padding: 16,
              textAlign: "center"
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
              <div style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>Recherche</div>
              <div style={{ color: "#bcd2ff", fontSize: 11, opacity: 0.8 }}>Exoplanètes</div>
            </div>
            <div style={{
              background: "rgba(74,222,128,0.1)",
              borderRadius: 12,
              padding: 16,
              textAlign: "center"
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
              <div style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>Analyse</div>
              <div style={{ color: "#bcd2ff", fontSize: 11, opacity: 0.8 }}>Données NASA</div>
            </div>
            <div style={{
              background: "rgba(74,222,128,0.1)",
              borderRadius: 12,
              padding: 16,
              textAlign: "center"
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
              <div style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>Missions</div>
              <div style={{ color: "#bcd2ff", fontSize: 11, opacity: 0.8 }}>Spatiales</div>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: "16px 32px",
                borderRadius: 12,
                border: "1px solid rgba(188, 210, 255, 0.25)",
                background: "rgba(20,30,60,0.55)",
                color: "#e6f0ff",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
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
              🚀 Commencer l'Exploration
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(1200px 600px at 50% 50%, rgba(140,170,255,0.06), rgba(0,0,0,0))" }} />
    </div>
  );
}
