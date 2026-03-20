"use client";

import { useState } from "react";
import LogoutButton from "./LogoutButton";
import TabLicencias from "./tabs/TabLicencias";
import TabCargaMasiva from "./tabs/TabCargaMasiva";
import TabBenchmark from "./tabs/TabBenchmark";
import TabROI from "./tabs/TabROI";
import TabModelos from "./tabs/TabModelos";
import TabCompetencia from "./tabs/TabCompetencia";
import TabProyeccion from "./tabs/TabProyeccion";

const TAB_NAMES = [
  "Licencias",
  "Carga masiva",
  "Benchmark",
  "ROI cliente",
  "Modelos de venta",
  "Competencia LATAM",
  "Proyección",
];

const TAB_COMPONENTS = [
  TabLicencias,
  TabCargaMasiva,
  TabBenchmark,
  TabROI,
  TabModelos,
  TabCompetencia,
  TabProyeccion,
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <>
      <header className="header">
        <div>
          <h1>LuminQA — Guía Comercial para Partners</h1>
          <div className="sub">Herramienta interna de simulación y pricing</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="badge">v2.0 — 2026</span>
          <LogoutButton />
        </div>
      </header>

      <div className="container">
        <div className="tabs">
          {TAB_NAMES.map((name, i) => (
            <button
              key={name}
              className={`tab ${i === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {name}
            </button>
          ))}
        </div>

        <ActiveComponent />
      </div>
    </>
  );
}
