"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import LogoutButton from "./LogoutButton";
import TabLicencias from "./tabs/TabLicencias";
import TabCargaMasiva from "./tabs/TabCargaMasiva";
import TabBenchmark from "./tabs/TabBenchmark";
import TabROI from "./tabs/TabROI";
import TabModelos from "./tabs/TabModelos";
import TabCompetencia from "./tabs/TabCompetencia";
import TabProyeccion from "./tabs/TabProyeccion";
import TabAdmin from "./tabs/TabAdmin";

const ADMIN_EMAILS = ["fernando@luminqa.com"];

const BASE_TABS = [
  { name: "Licencias", component: TabLicencias },
  { name: "Carga masiva", component: TabCargaMasiva },
  { name: "Benchmark", component: TabBenchmark },
  { name: "ROI cliente", component: TabROI },
  { name: "Modelos de venta", component: TabModelos },
  { name: "Competencia LATAM", component: TabCompetencia },
  { name: "Proyección", component: TabProyeccion },
];

const ADMIN_TAB = { name: "Administrador", component: TabAdmin };

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
        setIsAdmin(ADMIN_EMAILS.includes(user.email));
      }
    });
  }, []);

  const tabs = isAdmin ? [...BASE_TABS, ADMIN_TAB] : BASE_TABS;
  const ActiveComponent = tabs[activeTab]?.component ?? TabLicencias;

  return (
    <>
      <header className="header">
        <div>
          <h1>LuminQA — Guía Comercial para Partners</h1>
          <div className="sub">Herramienta interna de simulación y pricing</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {userEmail && (
            <span style={{ fontSize: 11, opacity: 0.6 }}>{userEmail}</span>
          )}
          <span className="badge">v2.0 — 2026</span>
          <LogoutButton />
        </div>
      </header>

      <div className="container">
        <div className="tabs">
          {tabs.map((tab, i) => (
            <button
              key={tab.name}
              className={`tab ${i === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(i)}
              style={
                tab.name === "Administrador"
                  ? { background: i === activeTab ? "var(--navy)" : undefined, color: i === activeTab ? "#fff" : "var(--navy)", fontWeight: 600 }
                  : undefined
              }
            >
              {tab.name}
            </button>
          ))}
        </div>

        <ActiveComponent />
      </div>
    </>
  );
}
