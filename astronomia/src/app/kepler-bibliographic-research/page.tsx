"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import StarfieldHyperdrive from "../components/StarfieldHyperdrive";

// Interface removed - now using Kepler agent for bibliographic research

interface KeplerResponse {
  success: boolean;
  result?: string;
  error?: string;
  tools_used?: string[];
}

export default function BibliographicResearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planetName = searchParams.get("planet");
  const hostname = searchParams.get("hostname");
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    { emoji: "🔍", message: "Searching arXiv database" },
    { emoji: "📚", message: "Analyzing astronomical publications" },
    { emoji: "🔬", message: "Reviewing research methodologies" },
    { emoji: "🧠", message: "AI synthesis and analysis" },
    { emoji: "📊", message: "Generating research insights" }
  ];

  const fetchBibliographicAnalysis = async (query: string) => {
    setLoading(true);
    setError(null);
    setLoadingStep(0);
    
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4000);
    
    try {
      const response = await fetch('http://localhost:8000/bibliographic/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planet_name: query,
          query: `Conduct a comprehensive bibliographic research on: ${query}. Focus on recent scientific literature, key discoveries, and research methodologies.`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: KeplerResponse = await response.json();
      
      if (data.success && data.result) {
        setAnalysis(data.result);
      } else {
        setError(data.error || 'Failed to analyze bibliographic data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  useEffect(() => {
    if (planetName) {
      const query = `exoplanet ${planetName} atmospheric composition habitability`;
      fetchBibliographicAnalysis(query);
    }
  }, [planetName]);

  const targetName = planetName || "Unknown Exoplanet";
  const targetHost = hostname || "Unknown Star";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
      color: "#e6f0ff",
      position: "relative",
      overflow: "hidden"
    }}>
      <StarfieldHyperdrive />
      
      {/* Header */}
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: "24px",
        textAlign: "center",
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(188,210,255,0.1)"
      }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          margin: "0 0 8px 0",
          background: "linear-gradient(135deg, #4ade80, #22c55e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          📚 Bibliographic Research
        </h1>
        <p style={{
          fontSize: 16,
          color: "#bcd2ff",
          margin: 0,
          opacity: 0.8
        }}>
          Scientific Literature Analysis for {targetName}
        </p>
        {targetHost && (
          <p style={{
            fontSize: 14,
            color: "#94a3b8",
            margin: "4px 0 0 0",
            opacity: 0.7
          }}>
            Host Star: {targetHost}
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: "24px",
        maxWidth: 1200,
        margin: "0 auto"
      }}>
        {/* Loading State */}
        {loading && (
          <div style={{
            background: "rgba(0,0,0,0.4)",
            borderRadius: 16,
            padding: 32,
            textAlign: "center",
            border: "1px solid rgba(74,222,128,0.3)",
            backdropFilter: "blur(10px)",
            marginBottom: 24
          }}>
            <div style={{ color: "#4ade80", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              🔭 Johannes Kepler is conducting bibliographic research...
            </div>
            <div style={{ 
              color: "#bcd2ff", 
              fontSize: 16, 
              fontWeight: 500,
              marginBottom: 20,
              textAlign: "center",
              minHeight: 24
            }}>
              {loadingSteps[loadingStep]?.emoji} {loadingSteps[loadingStep]?.message}
            </div>
            
            {/* Spinning loader */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              margin: "20px 0"
            }}>
              <div style={{
                position: "relative",
                width: 60,
                height: 60
              }}>
                {/* Outer ring */}
                <div style={{
                  position: "absolute",
                  width: 60,
                  height: 60,
                  border: "4px solid rgba(74,222,128,0.2)",
                  borderTop: "4px solid #4ade80",
                  borderRadius: "50%",
                  animation: "spin 1.2s linear infinite"
                }} />
                {/* Inner ring */}
                <div style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  width: 40,
                  height: 40,
                  border: "3px solid rgba(74,222,128,0.3)",
                  borderBottom: "3px solid #22c55e",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite reverse"
                }} />
                {/* Center dot */}
                <div style={{
                  position: "absolute",
                  top: 26,
                  left: 26,
                  width: 8,
                  height: 8,
                  backgroundColor: "#4ade80",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
              </div>
            </div>
            
            <div style={{ 
              color: "#bcd2ff", 
              fontSize: 12, 
              opacity: 0.7,
              textAlign: "center",
              fontStyle: "italic"
            }}>
              Step {loadingStep + 1} of {loadingSteps.length}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            textAlign: "center"
          }}>
            <div style={{ color: "#ef4444", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              ❌ Analysis Error
            </div>
            <div style={{ color: "#fca5a5", fontSize: 14 }}>
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div style={{ marginBottom: 24 }}>
            {/* Kepler Analysis Results */}
            <div style={{
              background: "rgba(0,0,0,0.3)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid rgba(74,222,128,0.2)",
              marginBottom: 24
            }}>
              <h2 style={{
                color: "#4ade80",
                fontSize: 20,
                fontWeight: 600,
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                🔭 Johannes Kepler's Bibliographic Research
              </h2>
              <div style={{
                background: "rgba(0,0,0,0.2)",
                padding: 16,
                borderRadius: 8,
                border: "1px solid rgba(188,210,255,0.1)"
              }}>
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 style={{ color: "#e6f0ff", fontSize: 18, margin: "0 0 12px 0", fontWeight: 600 }}>{children}</h1>,
                    h2: ({ children }) => <h2 style={{ color: "#e6f0ff", fontSize: 16, margin: "0 0 10px 0", fontWeight: 600 }}>{children}</h2>,
                    h3: ({ children }) => <h3 style={{ color: "#e6f0ff", fontSize: 15, margin: "0 0 8px 0", fontWeight: 600 }}>{children}</h3>,
                    h4: ({ children }) => <h4 style={{ color: "#e6f0ff", fontSize: 14, margin: "0 0 8px 0", fontWeight: 600 }}>{children}</h4>,
                    p: ({ children }) => <p style={{ color: "#bcd2ff", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px 0" }}>{children}</p>,
                    ul: ({ children }) => <ul style={{ color: "#bcd2ff", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px 0", paddingLeft: 20 }}>{children}</ul>,
                    ol: ({ children }) => <ol style={{ color: "#bcd2ff", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px 0", paddingLeft: 20 }}>{children}</ol>,
                    li: ({ children }) => <li style={{ margin: "4px 0", color: "#bcd2ff", fontSize: 14 }}>{children}</li>,
                    strong: ({ children }) => <strong style={{ color: "#e6f0ff", fontWeight: 600, fontSize: 14 }}>{children}</strong>,
                    em: ({ children }) => <em style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 14 }}>{children}</em>,
                    code: ({ children }) => <code style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>{children}</code>,
                    pre: ({ children }) => <pre style={{ background: "rgba(0,0,0,0.3)", color: "#bcd2ff", padding: 12, borderRadius: 8, overflow: "auto", fontSize: 13 }}>{children}</pre>,
                    blockquote: ({ children }) => <blockquote style={{ borderLeft: "3px solid #4ade80", paddingLeft: 12, margin: "8px 0", color: "#bcd2ff", fontStyle: "italic", fontSize: 14 }}>{children}</blockquote>,
                    a: ({ children, href }) => <a href={href} style={{ color: "#4ade80", textDecoration: "underline", fontSize: 14 }} target="_blank" rel="noopener noreferrer">{children}</a>,
                    table: ({ children }) => <table style={{ width: "100%", borderCollapse: "collapse", margin: "8px 0" }}>{children}</table>,
                    th: ({ children }) => <th style={{ border: "1px solid rgba(74,222,128,0.3)", padding: 8, background: "rgba(74,222,128,0.1)", color: "#e6f0ff", textAlign: "left", fontSize: 14 }}>{children}</th>,
                    td: ({ children }) => <td style={{ border: "1px solid rgba(74,222,128,0.2)", padding: 8, color: "#bcd2ff", fontSize: 14 }}>{children}</td>
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "rgba(0,0,0,0.3)",
              color: "#bcd2ff",
              border: "1px solid rgba(188,210,255,0.3)",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.5)";
              e.currentTarget.style.borderColor = "rgba(188,210,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.3)";
              e.currentTarget.style.borderColor = "rgba(188,210,255,0.3)";
            }}
          >
            ← Back to System Viewer
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
