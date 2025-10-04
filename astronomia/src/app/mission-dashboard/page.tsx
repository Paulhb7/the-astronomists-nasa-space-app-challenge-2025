"use client";
import React from "react";
import { useRouter } from "next/navigation";
import StarfieldHyperdrive from "../components/StarfieldHyperdrive";
import NavigationBar from "../components/NavigationMenu";

export default function MissionDashboardPage() {
  const router = useRouter();

  const activeMissions = [
    { 
      name: "TESS", 
      emoji: "🛰️", 
      url: "sc_tess", 
      description: "Surveying 200,000 stars for exoplanets",
      launchDate: "April 18, 2018",
      status: "Active",
      discoveries: "5,000+ exoplanet candidates",
      objective: "Find Earth-sized planets in the habitable zones of nearby stars",
      orbit: "Highly elliptical Earth orbit",
      instruments: "4 wide-field cameras",
      missionDuration: "2 years primary, extended through 2025"
    },
    { 
      name: "JWST", 
      emoji: "🔭", 
      url: "sc_jwst", 
      description: "Infrared telescope studying exoplanet atmospheres",
      launchDate: "December 25, 2021",
      status: "Active",
      discoveries: "First atmospheric analysis of exoplanets",
      objective: "Study the formation of stars and planets, and the origins of life",
      orbit: "L2 Lagrange point",
      instruments: "Near-Infrared Camera, Mid-Infrared Instrument, Near-Infrared Spectrograph",
      missionDuration: "5-10 years expected"
    }
  ];

  const completedMissions = [
    { 
      name: "Kepler", 
      emoji: "⭐", 
      url: "sc_kepler_space_telescope", 
      description: "Discovered 2,600+ confirmed exoplanets",
      launchDate: "March 7, 2009",
      status: "Retired (October 30, 2018)",
      discoveries: "2,662 confirmed exoplanets, 2,899 candidates",
      objective: "Determine the frequency of Earth-size and larger planets in the habitable zone",
      orbit: "Earth-trailing heliocentric orbit",
      instruments: "Photometer with 42 CCDs",
      missionDuration: "9.5 years (extended from 3.5 years)"
    },
    { 
      name: "Spitzer", 
      emoji: "🌌", 
      url: "sc_spitzer", 
      description: "Infrared observations of exoplanet systems",
      launchDate: "August 25, 2003",
      status: "Retired (January 30, 2020)",
      discoveries: "First detection of light from exoplanets",
      objective: "Study the universe in infrared wavelengths",
      orbit: "Earth-trailing heliocentric orbit",
      instruments: "Infrared Array Camera, Infrared Spectrograph, Multiband Imaging Photometer",
      missionDuration: "16.5 years (extended from 2.5 years)"
    },
    { 
      name: "Hubble", 
      emoji: "👁️", 
      url: "sc_hubble_space_telescope", 
      description: "Atmospheric studies of exoplanets",
      launchDate: "April 24, 1990",
      status: "Active (servicing missions completed)",
      discoveries: "First direct image of an exoplanet, atmospheric composition studies",
      objective: "Observe the universe in visible, ultraviolet, and near-infrared light",
      orbit: "Low Earth orbit (540 km altitude)",
      instruments: "Wide Field Camera 3, Cosmic Origins Spectrograph, Advanced Camera for Surveys",
      missionDuration: "30+ years (multiple servicing missions)"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative" }}>
      <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
      
      {/* Navigation Bar */}
      <NavigationBar pageTitle="Mission Dashboard" />

      {/* Content */}
      <div style={{ 
        position: "relative", 
        zIndex: 1,
        width: "95vw",
        maxWidth: 1400,
        marginLeft: "auto",
        marginRight: "auto",
        paddingTop: 80,
        paddingBottom: 200,
        paddingLeft: 24,
        paddingRight: 24
      }}>
        {/* Active Missions */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ 
            color: "#4ade80", 
            fontSize: 18, 
            fontWeight: 600, 
            marginBottom: 16,
            textAlign: "center"
          }}>
            🚀 Active Missions
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: 20 
          }}>
            {activeMissions.map((mission) => (
              <div
                key={mission.name}
                style={{
                  padding: "20px",
                  borderRadius: 16,
                  border: "1px solid rgba(74,222,128,0.3)",
                  background: "linear-gradient(135deg, rgba(74,222,128,0.1), rgba(74,222,128,0.05))",
                  color: "#e6f0ff",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  textAlign: "left",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(74,222,128,0.2), rgba(74,222,128,0.1))";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(74,222,128,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(74,222,128,0.1), rgba(74,222,128,0.05))";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 24 }}>{mission.emoji}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{mission.name}</div>
                    <div style={{ fontSize: 12, color: "#4ade80", fontWeight: 500 }}>{mission.status}</div>
                  </div>
                </div>
                
                <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
                  {mission.description}
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, opacity: 0.8 }}>
                  <div>
                    <div style={{ color: "#4ade80", fontWeight: 500 }}>Launch:</div>
                    <div>{mission.launchDate}</div>
                  </div>
                  <div>
                    <div style={{ color: "#4ade80", fontWeight: 500 }}>Duration:</div>
                    <div>{mission.missionDuration}</div>
                  </div>
                  <div>
                    <div style={{ color: "#4ade80", fontWeight: 500 }}>Orbit:</div>
                    <div>{mission.orbit}</div>
                  </div>
                  <div>
                    <div style={{ color: "#4ade80", fontWeight: 500 }}>Discoveries:</div>
                    <div>{mission.discoveries}</div>
                  </div>
                </div>
                
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  <div style={{ color: "#4ade80", fontWeight: 500, marginBottom: 4 }}>Objective:</div>
                  <div style={{ lineHeight: 1.4 }}>{mission.objective}</div>
                </div>
                
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  <div style={{ color: "#4ade80", fontWeight: 500, marginBottom: 4 }}>Instruments:</div>
                  <div style={{ lineHeight: 1.4 }}>{mission.instruments}</div>
                </div>
                
                <button
                  onClick={() => {
                    const missionViewerUrl = `/mission-viewer?mission=${encodeURIComponent(mission.name)}&url=${encodeURIComponent(mission.url)}&description=${encodeURIComponent(mission.description)}`;
                    window.location.href = missionViewerUrl;
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid rgba(74,222,128,0.3)",
                    background: "rgba(74,222,128,0.1)",
                    color: "#4ade80",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginTop: 8
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(74,222,128,0.2)";
                    e.currentTarget.style.color = "#e6f0ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(74,222,128,0.1)";
                    e.currentTarget.style.color = "#4ade80";
                  }}
                >
                  Launch Mission →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Missions */}
        <div>
          <h2 style={{ 
            color: "#f59e0b", 
            fontSize: 18, 
            fontWeight: 600, 
            marginBottom: 16,
            textAlign: "center"
          }}>
            🏆 Completed Missions
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: 20 
          }}>
            {completedMissions.map((mission) => (
              <div
                key={mission.name}
                style={{
                  padding: "20px",
                  borderRadius: 16,
                  border: "1px solid rgba(245,158,11,0.3)",
                  background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))",
                  color: "#e6f0ff",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  textAlign: "left",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(245,158,11,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 24 }}>{mission.emoji}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{mission.name}</div>
                    <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 500 }}>{mission.status}</div>
                  </div>
                </div>
                
                <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
                  {mission.description}
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, opacity: 0.8 }}>
                  <div>
                    <div style={{ color: "#f59e0b", fontWeight: 500 }}>Launch:</div>
                    <div>{mission.launchDate}</div>
                  </div>
                  <div>
                    <div style={{ color: "#f59e0b", fontWeight: 500 }}>Duration:</div>
                    <div>{mission.missionDuration}</div>
                  </div>
                  <div>
                    <div style={{ color: "#f59e0b", fontWeight: 500 }}>Orbit:</div>
                    <div>{mission.orbit}</div>
                  </div>
                  <div>
                    <div style={{ color: "#f59e0b", fontWeight: 500 }}>Discoveries:</div>
                    <div>{mission.discoveries}</div>
                  </div>
                </div>
                
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  <div style={{ color: "#f59e0b", fontWeight: 500, marginBottom: 4 }}>Objective:</div>
                  <div style={{ lineHeight: 1.4 }}>{mission.objective}</div>
                </div>
                
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  <div style={{ color: "#f59e0b", fontWeight: 500, marginBottom: 4 }}>Instruments:</div>
                  <div style={{ lineHeight: 1.4 }}>{mission.instruments}</div>
                </div>
                
                <button
                  onClick={() => {
                    const missionViewerUrl = `/mission-viewer?mission=${encodeURIComponent(mission.name)}&url=${encodeURIComponent(mission.url)}&description=${encodeURIComponent(mission.description)}`;
                    window.location.href = missionViewerUrl;
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid rgba(245,158,11,0.3)",
                    background: "rgba(245,158,11,0.1)",
                    color: "#f59e0b",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginTop: 8
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(245,158,11,0.2)";
                    e.currentTarget.style.color = "#e6f0ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(245,158,11,0.1)";
                    e.currentTarget.style.color = "#f59e0b";
                  }}
                >
                  Launch Mission →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
