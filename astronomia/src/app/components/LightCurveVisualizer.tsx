"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { LightCurveData } from './LightCurveSimulator';

// Register Chart.js components
Chart.register(...registerables);

interface LightCurveVisualizerProps {
  lightCurveData: LightCurveData | null;
  height?: number;
}

const LightCurveVisualizer: React.FC<LightCurveVisualizerProps> = ({ 
  lightCurveData, 
  height = 400 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lightCurveData || !chartRef.current) return;

    setIsLoading(true);

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data for Chart.js
    const { time, flux, fluxError, metadata } = lightCurveData;
    
    // Convert time to phase for better visualization
    const phase = time.map(t => (t % metadata.period) / metadata.period);
    
    // Sort data by phase for better visualization
    const sortedIndices = phase.map((p, i) => ({ phase: p, index: i }))
      .sort((a, b) => a.phase - b.phase)
      .map(item => item.index);

    const sortedPhase = sortedIndices.map(i => phase[i]);
    const sortedFlux = sortedIndices.map(i => flux[i]);
    const sortedFluxError = sortedIndices.map(i => fluxError[i]);

    const chartConfig: ChartConfiguration = {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Light Curve',
            data: sortedPhase.map((p, i) => ({
              x: p,
              y: sortedFlux[i]
            })),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 4,
            showLine: false,
            tension: 0
          },
          {
            label: 'Error Bars',
            data: sortedPhase.map((p, i) => ({
              x: p,
              y: sortedFlux[i]
            })),
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            borderColor: 'rgba(239, 68, 68, 0.8)',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 0,
            showLine: false,
            // Custom plugin for error bars would go here
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Light Curve: ${metadata.starName}`,
            color: '#e6f0ff',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            labels: {
              color: '#bcd2ff',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(6, 12, 26, 0.9)',
            titleColor: '#e6f0ff',
            bodyColor: '#bcd2ff',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1,
            callbacks: {
              title: (context) => {
                const dataPoint = context[0];
                const phase = dataPoint.parsed.x;
                const time = phase * metadata.period;
                return `Phase: ${phase.toFixed(4)} (Time: ${time.toFixed(2)} days)`;
              },
              label: (context) => {
                const flux = context.parsed.y;
                const fluxPercent = ((flux - 1) * 100).toFixed(3);
                return `Flux: ${flux.toFixed(6)} (${fluxPercent > 0 ? '+' : ''}${fluxPercent}%)`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Orbital Phase',
              color: '#9bb8ff',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              color: '#bcd2ff',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(188, 210, 255, 0.1)',
              drawBorder: true,
              borderColor: 'rgba(188, 210, 255, 0.3)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Normalized Flux',
              color: '#9bb8ff',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              color: '#bcd2ff',
              font: {
                size: 12
              },
              callback: function(value) {
                return (value as number).toFixed(4);
              }
            },
            grid: {
              color: 'rgba(188, 210, 255, 0.1)',
              drawBorder: true,
              borderColor: 'rgba(188, 210, 255, 0.3)'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverBackgroundColor: 'rgba(59, 130, 246, 0.8)',
            hoverBorderColor: 'rgba(59, 130, 246, 1)',
            hoverBorderWidth: 2
          }
        }
      }
    };

    // Create the chart
    chartInstanceRef.current = new Chart(ctx, chartConfig);
    
    setIsLoading(false);

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [lightCurveData, height]);

  if (!lightCurveData) {
    return (
      <div style={{
        height: height,
        background: "rgba(6,12,26,0.4)",
        borderRadius: 12,
        border: "1px solid rgba(188,210,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12
      }}>
        <div style={{ color: "#9bb8ff", fontSize: 16 }}>📊</div>
        <div style={{ color: "#bcd2ff", fontSize: 14, textAlign: "center" }}>
          No light curve data available
        </div>
        <div style={{ color: "#6b7280", fontSize: 12, textAlign: "center" }}>
          Generate simulated data or upload your own light curve file
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "rgba(6,12,26,0.6)",
      borderRadius: 12,
      border: "1px solid rgba(59,130,246,0.25)",
      padding: 16,
      marginBottom: 16
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 16
      }}>
        <h4 style={{ 
          color: "#e6f0ff", 
          fontSize: 16, 
          fontWeight: 600, 
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          📈 Light Curve Visualization
        </h4>
        
        {isLoading && (
          <div style={{ 
            color: "#9bb8ff", 
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <div style={{
              width: 12,
              height: 12,
              border: "2px solid rgba(59,130,246,0.3)",
              borderTop: "2px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            Loading...
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div style={{ 
        position: "relative", 
        height: height,
        background: "rgba(6,12,26,0.8)",
        borderRadius: 8,
        border: "1px solid rgba(188,210,255,0.15)",
        padding: 8
      }}>
        <canvas ref={chartRef} />
      </div>

      {/* Metadata Display */}
      <div style={{
        marginTop: 12,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 8
      }}>
        <div style={{
          background: "rgba(6,12,26,0.4)",
          borderRadius: 6,
          padding: "8px 12px",
          border: "1px solid rgba(188,210,255,0.15)"
        }}>
          <div style={{ color: "#9bb8ff", fontSize: 11, fontWeight: 600 }}>Period</div>
          <div style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 700 }}>
            {lightCurveData.metadata.period.toFixed(2)} days
          </div>
        </div>
        
        <div style={{
          background: "rgba(6,12,26,0.4)",
          borderRadius: 6,
          padding: "8px 12px",
          border: "1px solid rgba(188,210,255,0.15)"
        }}>
          <div style={{ color: "#9bb8ff", fontSize: 11, fontWeight: 600 }}>Duration</div>
          <div style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 700 }}>
            {lightCurveData.metadata.duration.toFixed(2)} hours
          </div>
        </div>
        
        <div style={{
          background: "rgba(6,12,26,0.4)",
          borderRadius: 6,
          padding: "8px 12px",
          border: "1px solid rgba(188,210,255,0.15)"
        }}>
          <div style={{ color: "#9bb8ff", fontSize: 11, fontWeight: 600 }}>Depth</div>
          <div style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 700 }}>
            {lightCurveData.metadata.depth.toFixed(0)} ppm
          </div>
        </div>
        
        <div style={{
          background: "rgba(6,12,26,0.4)",
          borderRadius: 6,
          padding: "8px 12px",
          border: "1px solid rgba(188,210,255,0.15)"
        }}>
          <div style={{ color: "#9bb8ff", fontSize: 11, fontWeight: 600 }}>Transits</div>
          <div style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 700 }}>
            {lightCurveData.metadata.transitCount}
          </div>
        </div>
        
        <div style={{
          background: "rgba(6,12,26,0.4)",
          borderRadius: 6,
          padding: "8px 12px",
          border: "1px solid rgba(188,210,255,0.15)"
        }}>
          <div style={{ color: "#9bb8ff", fontSize: 11, fontWeight: 600 }}>Data Points</div>
          <div style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 700 }}>
            {lightCurveData.time.length.toLocaleString()}
          </div>
        </div>
        
        <div style={{
          background: "rgba(6,12,26,0.4)",
          borderRadius: 6,
          padding: "8px 12px",
          border: "1px solid rgba(188,210,255,0.15)"
        }}>
          <div style={{ color: "#9bb8ff", fontSize: 11, fontWeight: 600 }}>Noise Level</div>
          <div style={{ color: "#e6f0ff", fontSize: 14, fontWeight: 700 }}>
            {(lightCurveData.metadata.noiseLevel * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Analysis Tools */}
      <div style={{
        marginTop: 12,
        display: "flex",
        gap: 8,
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => {
            if (chartInstanceRef.current) {
              const canvas = chartInstanceRef.current.canvas;
              const url = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = `light-curve-${lightCurveData.metadata.starName.replace(/\s+/g, '-')}.png`;
              link.href = url;
              link.click();
            }
          }}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid rgba(74, 222, 128, 0.25)",
            background: "rgba(74,222,128,0.2)",
            color: "#e6f0ff",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(74,222,128,0.2)",
            transition: "transform 0.15s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(74,222,128,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(74,222,128,0.2)";
          }}
        >
          💾 Export PNG
        </button>
        
        <button
          onClick={() => {
            const csvContent = [
              ['Time (days)', 'Phase', 'Flux', 'Flux Error'],
              ...lightCurveData.time.map((t, i) => [
                t.toFixed(6),
                ((t % lightCurveData.metadata.period) / lightCurveData.metadata.period).toFixed(6),
                lightCurveData.flux[i].toFixed(8),
                lightCurveData.fluxError[i].toFixed(8)
              ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `light-curve-data-${lightCurveData.metadata.starName.replace(/\s+/g, '-')}.csv`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid rgba(59, 130, 246, 0.25)",
            background: "rgba(59,130,246,0.2)",
            color: "#e6f0ff",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(59,130,246,0.2)",
            transition: "transform 0.15s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,0.2)";
          }}
        >
          📊 Export CSV
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LightCurveVisualizer;
