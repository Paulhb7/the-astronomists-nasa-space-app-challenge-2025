"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface NavigationBarProps {
  pageTitle?: string;
  showBackButton?: boolean;
  backPath?: string;
}

export default function NavigationBar({ pageTitle, showBackButton = false, backPath }: NavigationBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: "🏠"
    },
    {
      name: "Exploration Path",
      path: "/exploration-path",
      icon: "🔍"
    },
    {
      name: "Johannes Kepler Agent",
      path: "/kepler-input",
      icon: "🪐"
    },
    {
      name: "Grace Hopper Agent",
      path: "/grace-hopper-input",
      icon: "⚡"
    },
    {
      name: "Exoplanet Missions",
      path: "/mission-dashboard",
      icon: "🚀"
    }
  ];

  const isCurrentPage = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        background: "rgba(6,12,26,0.3)",
        borderBottom: "1px solid rgba(188,210,255,0.1)",
        backdropFilter: "blur(5px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px"
      }}>
        {/* Page Title */}
        <div style={{
          color: "#bcd2ff",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.05em",
          opacity: 0.9
        }}>
          {pageTitle || "The Astronomist"}
        </div>

        {/* Navigation Links */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              disabled={isCurrentPage(item.path)}
              style={{
                background: isCurrentPage(item.path) 
                  ? "rgba(74,222,128,0.15)" 
                  : "rgba(188,210,255,0.05)",
                border: isCurrentPage(item.path)
                  ? "1px solid rgba(74,222,128,0.3)"
                  : "1px solid rgba(188,210,255,0.1)",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: isCurrentPage(item.path) ? "default" : "pointer",
                color: isCurrentPage(item.path) ? "#4ade80" : "#bcd2ff",
                fontSize: 11,
                fontWeight: 400,
                display: "flex",
                alignItems: "center",
                gap: 4,
                transition: "all 0.3s ease",
                opacity: isCurrentPage(item.path) ? 0.8 : 0.9
              }}
              onMouseEnter={(e) => {
                if (!isCurrentPage(item.path)) {
                  e.currentTarget.style.background = "rgba(188,210,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(188,210,255,0.2)";
                  e.currentTarget.style.opacity = "1";
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrentPage(item.path)) {
                  e.currentTarget.style.background = "rgba(188,210,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(188,210,255,0.1)";
                  e.currentTarget.style.opacity = "0.9";
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}

          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={handleBack}
              style={{
                background: "rgba(188,210,255,0.05)",
                border: "1px solid rgba(188,210,255,0.1)",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                color: "#bcd2ff",
                fontSize: 11,
                fontWeight: 400,
                display: "flex",
                alignItems: "center",
                gap: 4,
                transition: "all 0.3s ease",
                opacity: 0.8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(188,210,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(188,210,255,0.2)";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(188,210,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(188,210,255,0.1)";
                e.currentTarget.style.opacity = "0.8";
              }}
            >
              <span>←</span>
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

    </>
  );
}
