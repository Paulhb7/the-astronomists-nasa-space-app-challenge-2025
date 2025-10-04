"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import StarfieldHyperdrive from "../components/StarfieldHyperdrive";
import NasaEyesEmbed from "../components/NasaEyesEmbed";
import NavigationBar from "../components/NavigationMenu";
import { fetchExoplanetData, ExoplanetData } from "../services/nasaApi";

interface KeplerAnalysis {
  success: boolean;
  result?: string;
  error?: string;
  tools_used?: string[];
}

export default function AstronomerReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetName = searchParams.get('planet');
  const hostname = searchParams.get('hostname');
  const isCustom = searchParams.get('custom') === 'true';
  
  const [exoplanetData, setExoplanetData] = useState<ExoplanetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keplerAnalysis, setKeplerAnalysis] = useState<KeplerAnalysis | null>(null);
  const [keplerLoading, setKeplerLoading] = useState(false);
  const [keplerError, setKeplerError] = useState<string | null>(null);
  const [graceHopperAnalysis, setGraceHopperAnalysis] = useState<KeplerAnalysis | null>(null);
  const [graceHopperLoading, setGraceHopperLoading] = useState(false);
  const [graceHopperError, setGraceHopperError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Loading steps with emojis and messages
  const loadingSteps = [
    { emoji: "🛰️", message: "Connecting to NASA Exoplanet Archive API" },
    { emoji: "📊", message: "Analysing data" },
    { emoji: "📚", message: "Researching scientific literature" },
    { emoji: "🌐", message: "Web search to gather more data" },
    { emoji: "🧠", message: "Gathering and analysing informations" }
  ];

  // Fetch Grace Hopper AI analysis
  const fetchGraceHopperAnalysis = async (planetName: string) => {
    setGraceHopperLoading(true);
    setGraceHopperError(null);
    setLoadingStep(0);
    
    // Simulate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    try {
      const response = await fetch('http://localhost:8000/grace-hopper/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: 'grace_hopper',
          planet: planetName,
          hostname: hostname,
          custom_data: {
            distance: searchParams.get('distance'),
            stellarType: searchParams.get('stellarType'),
            orbitalPeriod: searchParams.get('orbitalPeriod'),
            semiMajorAxis: searchParams.get('semiMajorAxis'),
            planetRadius: searchParams.get('planetRadius'),
            planetMass: searchParams.get('planetMass'),
            equilibriumTemp: searchParams.get('equilibriumTemp'),
            discoveryMethod: searchParams.get('discoveryMethod'),
            discoveryYear: searchParams.get('discoveryYear')
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGraceHopperAnalysis(data);
    } catch (error) {
      console.error('Error fetching Grace Hopper analysis:', error);
      setGraceHopperError(error instanceof Error ? error.message : 'Failed to fetch Grace Hopper analysis');
    } finally {
      clearInterval(stepInterval);
      setGraceHopperLoading(false);
    }
  };

  // Fetch Kepler AI analysis
  const fetchKeplerAnalysis = async (planetName: string) => {
    setKeplerLoading(true);
    setKeplerError(null);
    setLoadingStep(0);
    
    // Simulate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 5000); // Change step every 5 seconds
    
    try {
      const response = await fetch('http://localhost:8000/kepler/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planet_name: planetName,
          query: `Give me a synthetic sheet for exoplanet ${planetName} (key parameters, host star, discoveries & references).`
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setKeplerAnalysis(data);
    } catch (err) {
      setKeplerError(err instanceof Error ? err.message : 'Failed to fetch Kepler analysis');
    } finally {
      clearInterval(stepInterval);
      setKeplerLoading(false);
      setLoadingStep(0);
    }
  };

  // Chat with Kepler AI
  const sendChatMessage = async (message: string) => {
    if (!message.trim() || chatLoading) return;
    
    const userMessage = { role: 'user' as const, content: message };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);
    
    try {
      // Add context about the current exoplanet to the message
      const contextualMessage = `You are currently analyzing the exoplanet ${targetName}. ${message}`;
      
      const response = await fetch('http://localhost:8000/kepler/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planet_name: targetName || 'exoplanet',
          query: contextualMessage
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const assistantMessage = { role: 'assistant' as const, content: data.result || 'No response' };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = { role: 'assistant' as const, content: `Error: ${data.error || 'Unknown error'}` };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      const errorMessage = { role: 'assistant' as const, content: `Error: ${err instanceof Error ? err.message : 'Failed to send message'}` };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

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
      
      // Fetch Grace Hopper analysis (instead of Kepler for custom data)
      if (isCustom) {
        fetchGraceHopperAnalysis(targetName);
      } else {
        fetchKeplerAnalysis(targetName);
      }
    }
  }, [targetName, isCustom, searchParams]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
        <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          height: "100vh",
          color: "#bcd2ff",
          fontSize: 18,
          fontWeight: 600
        }}>
          <div style={{
            width: 60,
            height: 60,
            border: "4px solid rgba(188,210,255,0.3)",
            borderTop: "4px solid #bcd2ff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: 24
          }} />
          Loading Astronomer Report...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
        <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          height: "100vh",
          color: "#ff6b6b",
          textAlign: "center"
        }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: "8px" }}>Error loading data</div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
      <StarfieldHyperdrive speed={0.05} warpBoost={1.2} />
      
      {/* Navigation Bar */}
      <NavigationBar 
        pageTitle={`Astronomer Report - ${targetName}`}
        showBackButton={true}
        backPath={`/kepler-system-viewer?planet=${encodeURIComponent(targetName || '')}&hostname=${encodeURIComponent(hostname || '')}`}
      />

      {/* Two-Column Layout: Report + Planet View */}
      <div style={{ 
        position: "absolute", 
        top: 80, 
        left: 24, 
        right: 24,
        bottom: 24,
        zIndex: 1,
        display: "flex",
        gap: 24
      }}>
        {/* Left Column: Astronomer Report */}
        <div style={{ 
          flex: 2,
          background: "linear-gradient(180deg, rgba(6,12,26,0.9), rgba(6,12,26,0.75))",
          borderRadius: 16,
          border: "1px solid rgba(188,210,255,0.25)",
          padding: 24,
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(188,210,255,0.3) rgba(6,12,26,0.8)"
        }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: "0 0 8px 0", color: "#e6f0ff", fontSize: 24, fontWeight: 700 }}>
              🚀 Johannes Kepler AI Analysis
            </h1>
            <p style={{ margin: "0 0 24px 0", color: "#bcd2ff", fontSize: 14, opacity: 0.8 }}>
              AI-powered analysis for {targetName || "Unknown Exoplanet"}
            </p>
          </div>

          {/* AI Analysis */}
          {(keplerLoading || graceHopperLoading) && (
            <div style={{ 
              background: "rgba(59,130,246,0.1)", 
              borderRadius: 8, 
              padding: 16, 
              border: "1px solid rgba(59,130,246,0.3)",
              marginBottom: 24
            }}>
              <div style={{ color: "#3b82f6", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                🤖 Johannes Kepler AI is analyzing...
              </div>
              <div style={{ 
                color: "#bcd2ff", 
                fontSize: 14, 
                fontWeight: 500,
                marginBottom: 12,
                textAlign: "center",
                minHeight: 20
              }}>
                {loadingSteps[loadingStep]?.emoji} {loadingSteps[loadingStep]?.message}
              </div>
              
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
                    border: "3px solid rgba(59,130,246,0.2)",
                    borderTop: "3px solid #3b82f6",
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
                    border: "2px solid rgba(59,130,246,0.3)",
                    borderBottom: "2px solid #60a5fa",
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
                    backgroundColor: "#3b82f6",
                    borderRadius: "50%",
                    animation: "spin 0.5s linear infinite"
                  }} />
                </div>
              </div>
              
              <div style={{ 
                color: "#bcd2ff", 
                fontSize: 11, 
                opacity: 0.7,
                textAlign: "center",
                fontStyle: "italic"
              }}>
                Step {loadingStep + 1} of {loadingSteps.length}
              </div>
            </div>
          )}

          {keplerError && (
            <div style={{ 
              background: "rgba(239,68,68,0.1)", 
              borderRadius: 8, 
              padding: 16, 
              border: "1px solid rgba(239,68,68,0.3)",
              marginBottom: 24
            }}>
              <div style={{ color: "#ef4444", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                ❌ Kepler AI Error
              </div>
              <div style={{ color: "#bcd2ff", fontSize: 12, opacity: 0.8 }}>
                {keplerError}
              </div>
            </div>
          )}

          {((isCustom ? graceHopperAnalysis : keplerAnalysis) && (isCustom ? graceHopperAnalysis?.success : keplerAnalysis?.success)) && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
                {isCustom ? "🔭 Grace Hopper Analysis Report" : "🧠 Johannes Kepler Analysis Report"}
              </h3>
              <div style={{ 
                background: "rgba(16,185,129,0.1)", 
                borderRadius: 8, 
                padding: 16, 
                border: "1px solid rgba(16,185,129,0.3)",
                marginBottom: 16
              }}>
                <div style={{ color: "#10b981", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                  Tools Used: {(isCustom ? graceHopperAnalysis?.tools_used : keplerAnalysis?.tools_used)?.join(", ") || "N/A"}
                </div>
              </div>
              <div style={{ 
                background: "rgba(0,0,0,0.2)",
                padding: 16,
                borderRadius: 8,
                border: "1px solid rgba(188,210,255,0.1)"
              }}>
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 style={{ 
                        color: "#e6f0ff", 
                        fontSize: 20, 
                        fontWeight: 700, 
                        margin: "0 0 16px 0",
                        borderBottom: "1px solid rgba(188,210,255,0.3)",
                        paddingBottom: 8
                      }}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 style={{ 
                        color: "#e6f0ff", 
                        fontSize: 18, 
                        fontWeight: 600, 
                        margin: "16px 0 12px 0",
                        borderBottom: "1px solid rgba(188,210,255,0.2)",
                        paddingBottom: 6
                      }}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 style={{ 
                        color: "#e6f0ff", 
                        fontSize: 16, 
                        fontWeight: 600, 
                        margin: "12px 0 8px 0"
                      }}>
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 style={{ 
                        color: "#e6f0ff", 
                        fontSize: 14, 
                        fontWeight: 600, 
                        margin: "8px 0 6px 0"
                      }}>
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p style={{ 
                        color: "#cfe0ff", 
                        fontSize: 14, 
                        lineHeight: 1.6, 
                        margin: "0 0 12px 0"
                      }}>
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul style={{ 
                        color: "#cfe0ff", 
                        fontSize: 14, 
                        lineHeight: 1.6, 
                        margin: "0 0 12px 0",
                        paddingLeft: 20
                      }}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol style={{ 
                        color: "#cfe0ff", 
                        fontSize: 14, 
                        lineHeight: 1.6, 
                        margin: "0 0 12px 0",
                        paddingLeft: 20
                      }}>
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li style={{ 
                        color: "#cfe0ff", 
                        fontSize: 14, 
                        lineHeight: 1.6, 
                        margin: "0 0 4px 0"
                      }}>
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong style={{ 
                        color: "#e6f0ff", 
                        fontWeight: 600
                      }}>
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em style={{ 
                        color: "#bcd2ff", 
                        fontStyle: "italic"
                      }}>
                        {children}
                      </em>
                    ),
                    code: ({ children }) => (
                      <code style={{ 
                        color: "#4ade80", 
                        backgroundColor: "rgba(74,222,128,0.1)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 13,
                        fontFamily: "monospace"
                      }}>
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre style={{ 
                        color: "#cfe0ff", 
                        backgroundColor: "rgba(0,0,0,0.4)",
                        padding: 12,
                        borderRadius: 6,
                        fontSize: 13,
                        fontFamily: "monospace",
                        overflow: "auto",
                        margin: "12px 0"
                      }}>
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote style={{ 
                        color: "#bcd2ff", 
                        borderLeft: "4px solid rgba(188,210,255,0.3)",
                        paddingLeft: 16,
                        margin: "12px 0",
                        fontStyle: "italic"
                      }}>
                        {children}
                      </blockquote>
                    ),
                    a: ({ children, href }) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: "#4ade80", 
                          textDecoration: "underline",
                          textDecorationColor: "rgba(74,222,128,0.5)"
                        }}
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <table style={{ 
                        width: "100%",
                        borderCollapse: "collapse",
                        margin: "12px 0",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        borderRadius: 6,
                        overflow: "hidden"
                      }}>
                        {children}
                      </table>
                    ),
                    th: ({ children }) => (
                      <th style={{ 
                        color: "#e6f0ff",
                        backgroundColor: "rgba(188,210,255,0.1)",
                        padding: "8px 12px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: 13,
                        borderBottom: "1px solid rgba(188,210,255,0.2)"
                      }}>
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td style={{ 
                        color: "#cfe0ff",
                        padding: "8px 12px",
                        fontSize: 13,
                        borderBottom: "1px solid rgba(188,210,255,0.1)"
                      }}>
                        {children}
                      </td>
                    )
                  }}
                >
                  {isCustom ? graceHopperAnalysis?.result : keplerAnalysis?.result}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Fallback content if analysis fails */}
          {!keplerLoading && !graceHopperLoading && !keplerAnalysis && !graceHopperAnalysis && !keplerError && !graceHopperError && (
            <>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
              Executive Summary
            </h3>
            <p style={{ color: "#cfe0ff", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Based on our comprehensive analysis of {targetName}, this exoplanet presents fascinating characteristics 
              that warrant detailed investigation. The orbital dynamics and atmospheric composition suggest potential 
              for habitability studies and advanced spectroscopic observations.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
              Atmospheric Analysis
            </h3>
            <p style={{ color: "#cfe0ff", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Preliminary spectroscopic data indicates the presence of key atmospheric components. The temperature 
              profile and pressure gradients suggest a complex atmospheric structure that could support various 
              chemical processes and potentially harbor biosignatures.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
              Habitability Assessment
            </h3>
            <p style={{ color: "#cfe0ff", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              The planet's position within the habitable zone, combined with its mass and radius measurements, 
              suggests it could potentially support liquid water on its surface. Further observations are needed 
              to confirm atmospheric composition and surface conditions.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
              Recommendations
            </h3>
            <p style={{ color: "#cfe0ff", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              We recommend continued monitoring with advanced spectroscopic instruments, particularly focusing on 
              atmospheric composition analysis and potential biosignature detection. The system should be prioritized 
              for future direct imaging missions.
            </p>
          </div>
            </>
          )}

          <div style={{
            background: "rgba(74,222,128,0.1)",
            borderRadius: 8,
            padding: 16,
            border: "1px solid rgba(74,222,128,0.3)"
          }}>
            <h4 style={{ color: "#4ade80", margin: "0 0 8px 0", fontSize: 14, fontWeight: 600 }}>
              🎯 Mission Status: {keplerAnalysis?.success ? "AI Analysis Complete" : "Ready for Launch"}
            </h4>
            <p style={{ margin: "0 0 12px 0", fontSize: 13, opacity: 0.9, color: "#cfe0ff" }}>
              {keplerAnalysis?.success 
                ? `Johannes Kepler AI has completed analysis of ${targetName || "target"}.`
                : `All systems nominal. The exoplanet ${targetName || "target"} shows promising characteristics for further investigation.`
              }
            </p>
            
            {/* Chat Button */}
            {(isCustom ? graceHopperAnalysis?.success : keplerAnalysis?.success) && (
              <button
                onClick={() => setShowChat(!showChat)}
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "linear-gradient(90deg, #2563eb, #1e40af)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "linear-gradient(90deg, #3b82f6, #1d4ed8)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                💬 {showChat ? "Hide Chat" : "Ask Questions"}
              </button>
            )}

            {/* Chat Interface - Integrated inside the report box */}
            {showChat && (
              <div style={{
                marginTop: 24,
                background: "rgba(0,0,0,0.4)",
                borderRadius: 12,
                border: "1px solid rgba(188,210,255,0.2)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}>
                {/* Chat Header */}
                <div style={{
                  padding: 12,
                  borderBottom: "1px solid rgba(188,210,255,0.15)",
                  background: "rgba(59,130,246,0.1)"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#4ade80"
                    }} />
                    <h4 style={{
                      color: "#e6f0ff",
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0
                    }}>
                      💬 Chat with Johannes Kepler
                    </h4>
                    <div style={{
                      color: "#bcd2ff",
                      fontSize: 10,
                      opacity: 0.7
                    }}>
                      • {targetName}
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div style={{
                  height: 350,
                  padding: 16,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12
                }}>
                  {chatMessages.length === 0 && (
                    <div style={{
                      color: "#bcd2ff",
                      fontSize: 12,
                      opacity: 0.7,
                      textAlign: "center",
                      fontStyle: "italic",
                      marginTop: 16,
                      padding: 12
                    }}>
                      <div style={{ marginBottom: 16, fontSize: 13 }}>
                        Ask questions about <strong style={{ color: "#e6f0ff" }}>{targetName || "this exoplanet"}</strong>...
                      </div>
                      
                      {/* Starter Prompts */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginTop: 16
                      }}>
                        {[
                          "🌍 How does this compare to Earth?",
                          "🌡️ What is the atmospheric composition?",
                          "🏠 Is it potentially habitable?",
                          "🔬 What are the latest discoveries?",
                          "⭐ Tell me about the host star",
                          "📊 What are the key parameters?"
                        ].map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => sendChatMessage(prompt.replace(/^[^\s]+\s/, ''))}
                            disabled={chatLoading}
                            style={{
                              background: "rgba(59,130,246,0.1)",
                              border: "1px solid rgba(59,130,246,0.3)",
                              borderRadius: 8,
                              padding: "8px 12px",
                              color: "#bcd2ff",
                              fontSize: 11,
                              cursor: chatLoading ? "not-allowed" : "pointer",
                              transition: "all 0.2s ease",
                              textAlign: "left",
                              opacity: chatLoading ? 0.5 : 1
                            }}
                            onMouseOver={(e) => {
                              if (!chatLoading) {
                                e.currentTarget.style.background = "rgba(59,130,246,0.2)";
                                e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!chatLoading) {
                                e.currentTarget.style.background = "rgba(59,130,246,0.1)";
                                e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                              }
                            }}
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                        gap: 4
                      }}
                    >
                      <div style={{
                        background: message.role === 'user' 
                          ? "linear-gradient(90deg, #3b82f6, #1d4ed8)"
                          : "rgba(188,210,255,0.1)",
                        color: message.role === 'user' ? "white" : "#cfe0ff",
                        padding: "8px 12px",
                        borderRadius: message.role === 'user' ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                        maxWidth: "85%",
                        fontSize: 12,
                        lineHeight: 1.4,
                        boxShadow: message.role === 'user' 
                          ? "0 2px 8px rgba(59,130,246,0.3)"
                          : "0 1px 4px rgba(0,0,0,0.2)"
                      }}>
                        {message.role === 'assistant' && (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <div style={{ marginBottom: 6 }}>{children}</div>,
                              strong: ({ children }) => <strong style={{ color: "#e6f0ff" }}>{children}</strong>,
                              em: ({ children }) => <em style={{ color: "#bcd2ff" }}>{children}</em>
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )}
                        {message.role === 'user' && message.content}
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#bcd2ff",
                      fontSize: 12,
                      opacity: 0.7,
                      padding: "8px 12px"
                    }}>
                      <div style={{
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(188,210,255,0.3)",
                        borderTop: "2px solid #bcd2ff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      Johannes Kepler is thinking...
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div style={{
                  padding: 12,
                  borderTop: "1px solid rgba(188,210,255,0.15)",
                  background: "rgba(0,0,0,0.3)"
                }}>
                  <div style={{
                    display: "flex",
                    gap: 8
                  }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendChatMessage(chatInput);
                        }
                      }}
                      placeholder={`Ask about ${targetName || "this exoplanet"}...`}
                      disabled={chatLoading}
                      style={{
                        flex: 1,
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(188,210,255,0.2)",
                        borderRadius: 8,
                        padding: "8px 12px",
                        color: "#e6f0ff",
                        fontSize: 12,
                        outline: "none",
                        transition: "border-color 0.2s ease"
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(188,210,255,0.2)";
                      }}
                    />
                    <button
                      onClick={() => sendChatMessage(chatInput)}
                      disabled={!chatInput.trim() || chatLoading}
                      style={{
                        background: chatInput.trim() && !chatLoading 
                          ? "linear-gradient(90deg, #3b82f6, #1d4ed8)"
                          : "rgba(188,210,255,0.2)",
                        color: chatInput.trim() && !chatLoading ? "white" : "#bcd2ff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: chatInput.trim() && !chatLoading ? "pointer" : "not-allowed",
                        transition: "all 0.2s ease"
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Planet View + Habitability Report */}
        <div style={{ 
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          {/* Planet View */}
          <div style={{ 
            flex: 1,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 16,
            border: "1px solid rgba(188,210,255,0.25)",
            overflow: "hidden",
            position: "relative"
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
              Planet View
            </div>
            {targetName ? (
              <NasaEyesEmbed targetName={targetName} full />
            ) : (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#bcd2ff",
                textAlign: "center"
              }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "8px" }}>No planet data available</div>
                  <div style={{ fontSize: "14px", opacity: 0.8 }}>Unable to load planet visualization</div>
                </div>
              </div>
            )}
          </div>

          {/* Star Visualization */}
          <div style={{ 
            flex: 1,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 16,
            border: "1px solid rgba(188,210,255,0.25)",
            overflow: "hidden",
            position: "relative"
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
              ⭐ Host Star: {hostname || exoplanetData?.hostname || "Unknown"}
            </div>
            {(hostname || exoplanetData?.hostname) ? (
              <iframe
                src={`https://eyes.nasa.gov/apps/exo/#/star/${hostname || exoplanetData?.hostname}`}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: 16
                }}
                title={`NASA Eyes star focus for ${hostname || exoplanetData?.hostname}`}
                allow="fullscreen"
                loading="lazy"
              />
            ) : (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#bcd2ff",
                textAlign: "center",
                padding: 20
              }}>
                <div>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>⭐</div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Host Star Visualization</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Loading star data for {targetName || "exoplanet"}...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
