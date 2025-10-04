"use client";
import React from "react";
import { ExoplanetData, formatValueWithError, formatTemperature, formatDistance } from "../services/nasaApi";

interface ExoplanetDetailsProps {
  data?: ExoplanetData | null;
  loading?: boolean;
  error?: string | null;
}

export default function ExoplanetDetails({ data, loading, error }: ExoplanetDetailsProps) {
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "200px",
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
          <div>Loading exoplanet data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: "20px", 
        color: "#ff6b6b",
        textAlign: "center",
        background: "rgba(255,107,107,0.1)",
        borderRadius: "8px",
        border: "1px solid rgba(255,107,107,0.3)"
      }}>
        <div style={{ fontWeight: 600, marginBottom: "8px" }}>Error loading data</div>
        <div style={{ fontSize: "14px", opacity: 0.8 }}>{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ 
        padding: "20px", 
        color: "#bcd2ff",
        textAlign: "center"
      }}>
        No data available for this exoplanet.
      </div>
    );
  }

  return (
    <div style={{ color: "#cfe0ff", fontSize: 14, lineHeight: 1.6 }}>
      {/* Basic Information */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
          Basic Information
        </h3>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Planet Name:</span>
            <span style={{ fontWeight: 500 }}>{data.pl_name || 'N/A'}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Host Star:</span>
            <span style={{ fontWeight: 500 }}>{data.hostname || 'N/A'}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Discovery Method:</span>
            <span style={{ fontWeight: 500 }}>{data.discoverymethod || 'N/A'}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Discovery Year:</span>
            <span style={{ fontWeight: 500 }}>{data.disc_year || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Orbital Properties */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
          Orbital Properties
        </h3>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Orbital Period:</span>
            <span style={{ fontWeight: 500 }}>
              {formatValueWithError(data.pl_orbper, data.pl_orbpererr1, data.pl_orbpererr2, ' days')}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Semi-major Axis:</span>
            <span style={{ fontWeight: 500 }}>
              {formatValueWithError(data.pl_orbsmax, data.pl_orbsmaxerr1, data.pl_orbsmaxerr2, ' AU')}
            </span>
          </div>
        </div>
      </div>

      {/* Physical Properties */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
          Physical Properties
        </h3>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Radius:</span>
            <span style={{ fontWeight: 500 }}>
              {formatValueWithError(data.pl_rade, data.pl_radeerr1, data.pl_radeerr2, ' R⊕')}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Mass:</span>
            <span style={{ fontWeight: 500 }}>
              {formatValueWithError(data.pl_masse, data.pl_masseerr1, data.pl_masseerr2, ' M⊕')}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Equilibrium Temperature:</span>
            <span style={{ fontWeight: 500 }}>
              {formatTemperature(data.pl_eqt)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Insolation Flux:</span>
            <span style={{ fontWeight: 500 }}>
              {formatValueWithError(data.pl_insol, data.pl_insolerr1, data.pl_insolerr2, ' S⊕')}
            </span>
          </div>
        </div>
      </div>

      {/* Stellar Properties */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
          Stellar Properties
        </h3>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Effective Temperature:</span>
            <span style={{ fontWeight: 500 }}>
              {formatValueWithError(data.st_teff, data.st_tefferr1, data.st_tefferr2, ' K')}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Stellar Radius:</span>
            <span style={{ fontWeight: 500 }}>
              {formatValueWithError(data.st_rad, data.st_raderr1, data.st_raderr2, ' R☉')}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Stellar Mass:</span>
            <span style={{ fontWeight: 500 }}>
              {formatValueWithError(data.st_mass, data.st_masserr1, data.st_masserr2, ' M☉')}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Distance:</span>
            <span style={{ fontWeight: 500 }}>
              {formatDistance(data.sy_dist)}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#e6f0ff", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
          Additional Information
        </h3>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Controversy Flag:</span>
            <span style={{ fontWeight: 500, color: data.pl_controv_flag ? "#ff6b6b" : "#4ade80" }}>
              {data.pl_controv_flag ? 'Controversial' : 'Confirmed'}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8 }}>Last Updated:</span>
            <span style={{ fontWeight: 500 }}>
              {data.rowupdate ? new Date(data.rowupdate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>


      {/* Habitability Assessment */}
      {data.pl_rade && data.pl_eqt && (
        <div style={{ 
          marginTop: 20, 
          padding: 16, 
          background: "rgba(74,222,128,0.1)", 
          borderRadius: 8, 
          border: "1px solid rgba(74,222,128,0.3)" 
        }}>
          <h3 style={{ color: "#4ade80", margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
            Habitability Assessment
          </h3>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            {data.pl_rade > 0.8 && data.pl_rade < 1.4 && data.pl_eqt > 200 && data.pl_eqt < 350 ? (
              <div>
                <div style={{ color: "#4ade80", fontWeight: 600, marginBottom: 8 }}>
                  🌍 Potentially Habitable
                </div>
                <div style={{ opacity: 0.9 }}>
                  This exoplanet falls within the size and temperature range that could support liquid water on its surface.
                </div>
              </div>
            ) : (
              <div>
                <div style={{ color: "#fbbf24", fontWeight: 600, marginBottom: 8 }}>
                  ⚠️ Unlikely to be Habitable
                </div>
                <div style={{ opacity: 0.9 }}>
                  This exoplanet's size or temperature conditions make it unlikely to support Earth-like life.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
