"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StarfieldHyperdrive from "../components/StarfieldHyperdrive";
import NavigationBar from "../components/NavigationMenu";
import { fetchExoplanetData, ExoplanetData } from "../services/nasaApi";


export default function SystemViewerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetName = searchParams.get('planet');
  const hostname = searchParams.get('hostname');
  const isCustom = searchParams.get('custom') === 'true';
  
  const [exoplanetData, setExoplanetData] = useState<ExoplanetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch exoplanet data or use custom data
  useEffect(() => {
    if (targetName) {
      if (isCustom) {
        // Use custom data from URL parameters
        const customData: ExoplanetData = {
          pl_name: targetName,
          pl_letter: '',
          hostname: hostname || '',
          discoverymethod: searchParams.get('discoveryMethod') || '',
          disc_year: parseInt(searchParams.get('discoveryYear') || '0'),
          pl_orbper: parseFloat(searchParams.get('orbitalPeriod') || '0'),
          pl_orbpererr1: 0,
          pl_orbpererr2: 0,
          pl_orbsmax: parseFloat(searchParams.get('semiMajorAxis') || '0'),
          pl_orbsmaxerr1: 0,
          pl_orbsmaxerr2: 0,
          pl_rade: parseFloat(searchParams.get('planetRadius') || '0'),
          pl_radeerr1: 0,
          pl_radeerr2: 0,
          pl_masse: parseFloat(searchParams.get('planetMass') || '0'),
          pl_masseerr1: 0,
          pl_masseerr2: 0,
          pl_eqt: parseFloat(searchParams.get('equilibriumTemp') || '0'),
          pl_eqterr1: 0,
          pl_eqterr2: 0,
          pl_insol: 0,
          pl_insolerr1: 0,
          pl_insolerr2: 0,
          st_teff: parseFloat(searchParams.get('stellarType') || '0'),
          st_tefferr1: 0,
          st_tefferr2: 0,
          st_rad: 0,
          st_raderr1: 0,
          st_raderr2: 0,
          st_mass: 0,
          st_masserr1: 0,
          st_masserr2: 0,
          sy_dist: parseFloat(searchParams.get('distance') || '0'),
          sy_disterr1: 0,
          sy_disterr2: 0,
          pl_controv_flag: 0,
          pl_pubdate: '',
          rowupdate: ''
        };
        setExoplanetData(customData);
        setLoading(false);
      } else {
        // Fetch from NASA API
        setLoading(true);
        setError(null);
        
        fetchExoplanetData(targetName)
          .then((response) => {
            if (response.error) {
              setError(response.error);
            } else if (response.data.length > 0) {
              const data = response.data[0];
              setExoplanetData(data);
            } else {
              setError('No data found for this exoplanet');
            }
          })
          .catch((err) => {
            setError(err.message || 'Failed to fetch exoplanet data');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [targetName, isCustom, searchParams]);

  const generateAstronomerReport = () => {
    const astronomerReportUrl = `/kepler-results?planet=${encodeURIComponent(targetName || '')}&hostname=${encodeURIComponent(hostname || '')}&custom=${isCustom}`;
    window.location.href = astronomerReportUrl;
  };

  // Hide loading overlay when iframe loads
  useEffect(() => {
    const iframe = document.querySelector('iframe');
    const loadingOverlay = document.getElementById('nasa-eyes-loading');
    
    if (iframe && loadingOverlay) {
      const handleLoad = () => {
        setTimeout(() => {
          loadingOverlay.style.opacity = '0';
          setTimeout(() => {
            loadingOverlay.style.display = 'none';
          }, 300);
        }, 2000); // Wait 2 seconds to ensure NASA Eyes is fully loaded
      };
      
      iframe.addEventListener('load', handleLoad);
      
      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [exoplanetData]);

  if (!targetName) {
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
          <h2>No planet selected</h2>
          <button 
            onClick={() => router.push('/exploration-path')}
            style={{
              background: "rgba(140,170,255,0.22)",
              color: "#e6f0ff",
              border: "1px solid rgba(140,170,255,0.25)",
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 700,
              marginTop: 16
            }}
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
      <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
      
      {/* Navigation Bar */}
      <NavigationBar 
        pageTitle={`System Viewer - ${targetName}`}
        showBackButton={true}
        backPath={`/kepler-planet-results?planet=${encodeURIComponent(targetName || '')}`}
      />

      {/* System Information Panel - Top */}
      {exoplanetData && (
      <div style={{ 
        position: "absolute",
        top: 70, 
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          background: "linear-gradient(180deg, rgba(6,12,26,0.95), rgba(6,12,26,0.85))",
          borderRadius: 16,
          border: "1px solid rgba(188,210,255,0.25)",
          padding: "12px 16px",
          width: "95vw",
          maxWidth: 1400,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{ color: "#e6f0ff", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
            {exoplanetData.hostname} System
      </div>
        <div style={{ 
          color: "#bcd2ff", 
            fontSize: 13, 
            lineHeight: 1.3,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 6
          }}>
            <div>Host Star: {exoplanetData.hostname}</div>
            <div>Distance: {exoplanetData.sy_dist?.toFixed(2)} parsecs</div>
            <div>Stellar Type: {exoplanetData.st_teff ? `${exoplanetData.st_teff.toFixed(0)}K` : 'Unknown'}</div>
            {exoplanetData.pl_orbper && (
              <div>Orbital Period: {exoplanetData.pl_orbper.toFixed(1)} days</div>
            )}
            {exoplanetData.pl_orbsmax && (
              <div>Semi-major Axis: {exoplanetData.pl_orbsmax.toFixed(3)} AU</div>
            )}
          </div>
        </div>
      )}

      {/* Two-Column Layout: System View + Star Focus */}
      <div style={{ 
        position: "absolute", 
        top: exoplanetData ? 160 : 120, 
        left: "50%", 
        transform: "translateX(-50%)", 
        zIndex: 1,
        width: "95vw",
        height: exoplanetData ? "calc(100vh - 240px)" : "calc(100vh - 200px)",
        maxWidth: 1400,
        display: "flex",
        gap: 16
      }}>
        {loading ? (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%",
            width: "100%",
            color: "#bcd2ff"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                border: "3px solid rgba(188,210,255,0.3)",
                borderTop: "3px solid #8cc0ff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px"
              }} />
              <div>Loading NASA Eyes visualization...</div>
            </div>
          </div>
        ) : error ? (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%",
            width: "100%",
            color: "#ff6b6b",
            textAlign: "center"
          }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "8px" }}>Error loading data</div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>{error}</div>
            </div>
          </div>
        ) : exoplanetData?.hostname ? (
          <>
            {/* Left Column: System View */}
            <div style={{ 
              flex: 1,
              height: "100%",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(188,210,255,0.25)",
              background: "rgba(0,0,0,0.3)"
            }}>
              <div style={{
                position: "absolute",
                top: 8,
                left: 12,
                color: "#e6f0ff",
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(0,0,0,0.6)",
                padding: "4px 8px",
                borderRadius: 4,
                zIndex: 5
              }}>
                System View
              </div>
              <iframe
                src={`https://eyes.nasa.gov/apps/exo/#/system/${exoplanetData.hostname}`}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: 16
                }}
                title={`NASA Eyes system view for ${exoplanetData.hostname}`}
                allow="fullscreen"
                loading="lazy"
              />
            </div>

            {/* Right Column: Star Focus */}
            <div style={{ 
              flex: 1,
              height: "100%",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(188,210,255,0.25)",
              background: "rgba(0,0,0,0.3)"
            }}>
              <div style={{
                position: "absolute",
                top: 8,
                left: 12,
                color: "#e6f0ff",
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(0,0,0,0.6)",
                padding: "4px 8px",
                borderRadius: 4,
                zIndex: 5
              }}>
                Star Focus
              </div>
              <iframe
                src={`https://eyes.nasa.gov/apps/exo/#/star/${exoplanetData.hostname}`}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: 16
                }}
                title={`NASA Eyes star focus for ${exoplanetData.hostname}`}
                allow="fullscreen"
                loading="lazy"
              />
            </div>
          </>
        ) : (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%",
            width: "100%",
            color: "#bcd2ff",
            textAlign: "center"
          }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "8px" }}>No system data available</div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>Unable to load system visualization</div>
            </div>
          </div>
        )}
      </div>


      {/* Action Buttons - Below each iframe */}
      <div style={{ 
        position: "absolute", 
        bottom: 12,
        left: "50%", 
        transform: "translateX(-50%)", 
        zIndex: 10,
        width: "95vw",
        maxWidth: 1400,
        display: "flex",
        gap: 16
      }}>
        {/* Kepler Agent Button - Under left iframe */}
        <div style={{ flex: 1 }}>
          <button 
            onClick={generateAstronomerReport}
            style={{ 
              background: "linear-gradient(135deg, rgba(140,170,255,0.25), rgba(100,130,200,0.2))", 
              color: "#e6f0ff", 
              border: "1px solid rgba(188,210,255,0.3)", 
              borderRadius: 12,
              padding: "14px 20px", 
              cursor: "pointer", 
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 8px 20px rgba(140,170,255,0.15), 0 4px 12px rgba(0,0,0,0.1)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              width: "100%",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(140,170,255,0.35), rgba(100,130,200,0.3))";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 25px rgba(140,170,255,0.25), 0 6px 15px rgba(0,0,0,0.15)";
              e.currentTarget.style.borderColor = "rgba(188,210,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(140,170,255,0.25), rgba(100,130,200,0.2))";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(140,170,255,0.15), 0 4px 12px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = "rgba(188,210,255,0.3)";
            }}
          >
            <span style={{ fontSize: 16 }}>🪐</span>
            <span>Launch Kepler Agent</span>
          </button>
        </div>

        {/* Bibliographic Research Button - Under right iframe */}
        <div style={{ flex: 1 }}>
          <button 
            onClick={() => router.push('/kepler-bibliographic-research?planet=' + encodeURIComponent(targetName || '') + '&hostname=' + encodeURIComponent(hostname || ''))}
            style={{ 
              background: "linear-gradient(135deg, rgba(74,222,128,0.25), rgba(34,197,94,0.2))", 
              color: "#e6f0ff", 
              border: "1px solid rgba(74,222,128,0.3)", 
              borderRadius: 12,
              padding: "14px 20px", 
              cursor: "pointer", 
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 8px 20px rgba(74,222,128,0.15), 0 4px 12px rgba(0,0,0,0.1)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              width: "100%",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(74,222,128,0.35), rgba(34,197,94,0.3))";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 25px rgba(74,222,128,0.25), 0 6px 15px rgba(0,0,0,0.15)";
              e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(74,222,128,0.25), rgba(34,197,94,0.2))";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(74,222,128,0.15), 0 4px 12px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)";
            }}
          >
            <span style={{ fontSize: 16 }}>📚</span>
            <span>Bibliographic Agent</span>
          </button>
        </div>
      </div>


      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

