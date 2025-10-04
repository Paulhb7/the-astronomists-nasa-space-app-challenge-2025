"use client";
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, BarChart3, Settings } from 'lucide-react';

interface LightCurveUploadProps {
  onFileUpload?: (file: File, options: AnalysisOptions) => void;
  onAnalysisComplete?: (results: any) => void;
}

interface AnalysisOptions {
  detrending: string;
  minPeriod: number;
  maxPeriod: number;
  threshold: number;
}

export default function LightCurveUpload({ onFileUpload, onAnalysisComplete }: LightCurveUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [options, setOptions] = useState<AnalysisOptions>({
    detrending: 'auto',
    minPeriod: 0.5,
    maxPeriod: 50,
    threshold: 7.0
  });
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/fits': ['.fits'],
      'application/octet-stream': ['.fits'],
      'text/plain': ['.txt', '.dat']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError(null);
      }
    },
    onDropRejected: fileRejections => {
      setError(fileRejections[0].errors[0].message);
    }
  });
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Call parent callback if provided
      if (onFileUpload) {
        onFileUpload(file, options);
      }
      
      // Simulate analysis results
      const mockResults = {
        upload_id: `analysis_${Date.now()}`,
        file_name: file.name,
        analysis_status: 'completed',
        detected_periods: [
          { period: 2.5, significance: 8.2, depth: 0.0015 },
          { period: 5.1, significance: 6.8, depth: 0.0008 }
        ],
        transit_candidates: [
          { epoch: 2458000.5, duration: 2.3, depth: 0.0015, period: 2.5 }
        ],
        quality_metrics: {
          snr: 12.4,
          detrending_method: options.detrending,
          data_points: 15420
        }
      };
      
      if (onAnalysisComplete) {
        onAnalysisComplete(mockResults);
      }
      
      // Reset after short delay
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1000);
      
    } catch (err) {
      setError('Upload failed. Please check your file and try again.');
      setUploading(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ 
      background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(37,99,235,0.2))",
      borderRadius: 12,
      border: "1px solid rgba(59,130,246,0.25)",
      padding: 16,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)"
    }}>
      <h3 style={{ 
        color: "#e6f0ff", 
        fontSize: 16, 
        fontWeight: 600, 
        margin: "0 0 8px 0",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        📊 Light Curve Analysis & Upload
      </h3>
      
      {!uploading ? (
        <>
          {/* Upload Zone */}
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed",
              borderColor: isDragActive ? "rgba(59,130,246,0.6)" : "rgba(188,210,255,0.25)",
              borderRadius: 12,
              padding: "24px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: isDragActive ? "rgba(59,130,246,0.1)" : "rgba(6,12,26,0.4)",
              marginBottom: 16
            }}
          >
            <input {...getInputProps()} />
            <Upload style={{ width: 32, height: 32, margin: "0 auto 12px", color: "#3b82f6" }} />
            {file ? (
              <div>
                <FileText style={{ width: 24, height: 24, margin: "0 auto 8px", color: "#10b981" }} />
                <p style={{ color: "#e6f0ff", fontWeight: 600, margin: "0 0 4px 0" }}>{file.name}</p>
                <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>{formatFileSize(file.size)}</p>
              </div>
            ) : (
              <>
                <p style={{ color: "#e6f0ff", fontSize: 14, margin: "0 0 8px 0" }}>
                  {isDragActive ? 'Drop file here...' : 'Drop FITS or CSV file here, or click to browse'}
                </p>
                <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>Maximum file size: 50 MB</p>
              </>
            )}
          </div>
          
          {error && (
            <div style={{
              marginBottom: 16,
              padding: "12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <AlertCircle style={{ width: 16, height: 16, color: "#ef4444" }} />
              <span style={{ color: "#ef4444", fontSize: 12 }}>{error}</span>
            </div>
          )}
          
          {/* Format Instructions */}
          <details style={{ marginBottom: 16 }}>
            <summary style={{ 
              cursor: "pointer", 
              color: "#3b82f6", 
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8
            }}>
              📋 Format Instructions
            </summary>
            <div style={{ 
              marginTop: 8,
              padding: "12px",
              background: "rgba(6,12,26,0.6)",
              borderRadius: 8,
              border: "1px solid rgba(188,210,255,0.15)"
            }}>
              <div style={{ color: "#9ca3af", fontSize: 11, marginBottom: 8 }}>
                <strong>FITS:</strong> Standard Kepler/TESS light-curve structure with TIME and PDCSAP_FLUX columns
              </div>
              <div style={{ color: "#9ca3af", fontSize: 11, marginBottom: 8 }}>
                <strong>CSV:</strong> Columns: <code style={{ background: "rgba(6,12,26,0.8)", padding: "2px 4px", borderRadius: 4 }}>time</code> (BJD), <code style={{ background: "rgba(6,12,26,0.8)", padding: "2px 4px", borderRadius: 4 }}>flux</code> (normalized), optional <code style={{ background: "rgba(6,12,26,0.8)", padding: "2px 4px", borderRadius: 4 }}>flux_err</code>
              </div>
              <div style={{ color: "#9ca3af", fontSize: 11 }}>
                <strong>TXT/DAT:</strong> Space-separated values with time and flux columns
              </div>
            </div>
          </details>
          
          {/* Advanced Options */}
          <div style={{ marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid rgba(59,130,246,0.25)",
                background: "rgba(59,130,246,0.2)",
                color: "#e6f0ff",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: showAdvancedOptions ? 12 : 0,
                transition: "all 0.2s ease"
              }}
            >
              <Settings style={{ width: 14, height: 14 }} />
              {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
            </button>
            
            {showAdvancedOptions && (
              <div style={{
                background: "rgba(6,12,26,0.6)",
                borderRadius: 8,
                padding: 12,
                border: "1px solid rgba(188,210,255,0.15)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12
              }}>
                <div>
                  <label style={{ color: "#9ca3af", fontSize: 11, marginBottom: 4, display: "block" }}>
                    Detrending Method
                  </label>
                  <select
                    value={options.detrending}
                    onChange={e => setOptions({...options, detrending: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 4,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                  >
                    <option value="auto">Auto</option>
                    <option value="gp">Gaussian Process</option>
                    <option value="median">Median Filter</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ color: "#9ca3af", fontSize: 11, marginBottom: 4, display: "block" }}>
                    Detection Threshold (SDE)
                  </label>
                  <input
                    type="number"
                    value={options.threshold}
                    onChange={e => setOptions({...options, threshold: parseFloat(e.target.value)})}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 4,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label style={{ color: "#9ca3af", fontSize: 11, marginBottom: 4, display: "block" }}>
                    Min Period (days)
                  </label>
                  <input
                    type="number"
                    value={options.minPeriod}
                    onChange={e => setOptions({...options, minPeriod: parseFloat(e.target.value)})}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 4,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label style={{ color: "#9ca3af", fontSize: 11, marginBottom: 4, display: "block" }}>
                    Max Period (days)
                  </label>
                  <input
                    type="number"
                    value={options.maxPeriod}
                    onChange={e => setOptions({...options, maxPeriod: parseFloat(e.target.value)})}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 4,
                      border: "1px solid rgba(188,210,255,0.25)",
                      background: "rgba(6,12,26,0.8)",
                      color: "#e6f0ff",
                      fontSize: 12,
                      outline: "none"
                    }}
                    step="1"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Analyze Button */}
          <button
            onClick={handleUpload}
            disabled={!file}
            style={{
              width: "100%",
              padding: "12px 24px",
              borderRadius: 8,
              border: "1px solid rgba(59,130,246,0.25)",
              background: !file ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.3)",
              color: !file ? "#6b7280" : "#e6f0ff",
              fontWeight: 600,
              fontSize: 14,
              cursor: !file ? "not-allowed" : "pointer",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 8px 32px rgba(59,130,246,0.2)",
              transition: "all 0.2s ease",
              opacity: !file ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
            onMouseEnter={(e) => {
              if (file) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(59,130,246,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (file) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(59,130,246,0.2)";
              }
            }}
          >
            <BarChart3 style={{ width: 16, height: 16 }} />
            Analyze Light Curve
          </button>
        </>
      ) : (
        /* Processing UI */
        <div style={{ textAlign: "center", padding: "24px" }}>
          <Loader2 style={{ width: 32, height: 32, margin: "0 auto 16px", color: "#3b82f6", animation: "spin 1s linear infinite" }} />
          <h2 style={{ color: "#e6f0ff", fontSize: 16, fontWeight: 600, margin: "0 0 16px 0" }}>
            Processing your data...
          </h2>
          
          {/* Progress Bar */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              width: "100%", 
              background: "rgba(107,114,128,0.3)", 
              borderRadius: 8, 
              height: 8, 
              overflow: "hidden",
              marginBottom: 8
            }}>
              <div
                style={{ 
                  background: "linear-gradient(90deg, rgba(59,130,246,0.8), rgba(59,130,246,1))",
                  height: "100%", 
                  borderRadius: 8, 
                  transition: "width 0.3s ease",
                  width: `${progress}%`
                }}
              />
            </div>
            <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>{progress}% complete</p>
          </div>
          
          {/* Processing Steps */}
          <div style={{ textAlign: "left" }}>
            {[
              { label: 'Uploading file', threshold: 20 },
              { label: 'Detrending light curve', threshold: 40 },
              { label: 'Running transit search', threshold: 60 },
              { label: 'Extracting features', threshold: 80 },
              { label: 'Classifying with AI model', threshold: 95 }
            ].map((step, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                {progress >= step.threshold ? (
                  <CheckCircle style={{ width: 16, height: 16, color: "#10b981" }} />
                ) : (
                  <div style={{ width: 16, height: 16, border: "2px solid #6b7280", borderRadius: "50%" }} />
                )}
                <span style={{ 
                  color: progress >= step.threshold ? "#10b981" : "#9ca3af",
                  fontSize: 12
                }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
