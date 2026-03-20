"use client";

import { useState } from "react";
import { getLicPrice, getLicTier } from "@/lib/pricing";

export default function TabLicencias() {
  const [qty, setQty] = useState(8);
  const [months, setMonths] = useState(12);

  const price = getLicPrice(qty);
  const monthly = qty * price;
  const tier = getLicTier(qty);

  return (
    <div>
      <div className="section-title">Estructura de licencias LuminQA</div>
      <div className="section-sub">
        Precio por licencia/mes según volumen. Cada licencia incluye 100
        créditos/mes para generación y self-healing.
      </div>

      <div className="grid g3" style={{ marginBottom: 20 }}>
        <div className="card tier-card">
          <div className="tier-name">Starter</div>
          <div className="tier-range">1 a 5 licencias</div>
          <div className="tier-price">
            $999 <span>USD/mes por licencia</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 12,
            }}
          >
            100 créditos/licencia/mes
          </div>
          <div className="sep"></div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--navy)",
              }}
            >
              Soporte y servicio:
            </div>
            <div
              style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.8 }}
            >
              Soporte email (48 hrs)
              <br />
              Documentación + sesión inicial
              <br />
              Sin reviews de cobertura programados
            </div>
          </div>
        </div>

        <div
          className="card tier-card"
          style={{ border: "2px solid var(--accent)" }}
        >
          <div className="badge-card">MÁS POPULAR</div>
          <div className="tier-name">Professional</div>
          <div className="tier-range">6 a 14 licencias</div>
          <div className="tier-price">
            $833 <span>USD/mes por licencia</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 12,
            }}
          >
            100 créditos/licencia/mes
          </div>
          <div className="sep"></div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--navy)",
              }}
            >
              Soporte y servicio:
            </div>
            <div
              style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.8 }}
            >
              Soporte prioritario (24 hrs)
              <br />
              Onboarding asistido + training
              <br />
              Reviews de cobertura trimestrales
            </div>
          </div>
        </div>

        <div className="card tier-card">
          <div className="tier-name">Enterprise</div>
          <div className="tier-range">15 o más licencias</div>
          <div className="tier-price">
            $714 <span>USD/mes por licencia</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 12,
            }}
          >
            100 créditos/licencia/mes
          </div>
          <div className="sep"></div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--navy)",
              }}
            >
              Soporte y servicio:
            </div>
            <div
              style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.8 }}
            >
              Soporte dedicado (8 hrs SLA)
              <br />
              Onboarding completo + consultor
              <br />
              Reviews de cobertura mensuales
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Incluido en todos los planes (sin excepción)</h3>
        <div className="feature-grid">
          {[
            "100 créditos/mes por licencia (generación + self-healing)",
            "Ejecuciones ilimitadas en infra del cliente",
            "Self-healing con IA + acceso a código fuente",
            "Regresión nocturna E2E automática",
            "Integración Jira + Git (repositorios ilimitados)",
            "Dashboard y reportes en tiempo real",
            "Dispositivos ilimitados",
            "Deployment flexible (SaaS o on-premise)",
            "Código Playwright/Selenium exportable",
            "Cero vendor lock-in",
          ].map((f) => (
            <div className="feature-item" key={f}>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <h3>Simulador de licencias</h3>
          <div className="slider-row">
            <label>Cantidad de licencias</label>
            <input
              type="range"
              min={1}
              max={50}
              value={qty}
              onChange={(e) => setQty(+e.target.value)}
            />
            <span className="out">{qty}</span>
          </div>
          <div className="slider-row">
            <label>Meses de compromiso</label>
            <input
              type="range"
              min={1}
              max={24}
              value={months}
              onChange={(e) => setMonths(+e.target.value)}
            />
            <span className="out">{months}</span>
          </div>
          <div className="grid g3" style={{ marginTop: 12 }}>
            <div
              style={{
                background: "var(--accentLight)",
                borderRadius: 8,
                padding: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--accent2)" }}>Tier</div>
              <div
                style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)" }}
              >
                {tier}
              </div>
            </div>
            <div
              style={{
                background: "var(--accentLight)",
                borderRadius: 8,
                padding: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--accent2)" }}>
                Mensual
              </div>
              <div
                style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)" }}
              >
                ${monthly.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                background: "var(--accentLight)",
                borderRadius: 8,
                padding: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--accent2)" }}>
                Total período
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                ${(monthly * months).toLocaleString()}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Créditos totales: {(qty * 100).toLocaleString()}/mes (generación +
              self-healing)
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Recarga de créditos</h3>
          <p
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 12,
            }}
          >
            Una vez agotados los créditos incluidos en la licencia, se pueden
            adquirir paquetes adicionales de 100 créditos al mismo valor por
            crédito del plan contratado:
          </p>
          <table>
            <thead>
              <tr>
                <th>Plan contratado</th>
                <th>Precio/crédito</th>
                <th>Paquete de 100</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Starter</b> (1-5 lic.)</td>
                <td>$9.99</td>
                <td>$999</td>
              </tr>
              <tr className="hl">
                <td><b>Professional</b> (6-14 lic.)</td>
                <td>$8.33</td>
                <td>$833</td>
              </tr>
              <tr>
                <td><b>Enterprise</b> (15+ lic.)</td>
                <td>$7.14</td>
                <td>$714</td>
              </tr>
            </tbody>
          </table>
          <div className="note">
            El valor por crédito de recarga es idéntico al de tu plan. Los
            créditos adicionales se suman a los incluidos en la licencia y no
            tienen vencimiento mientras la licencia esté activa.
          </div>
        </div>
      </div>
    </div>
  );
}
