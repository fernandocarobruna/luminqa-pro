"use client";

import { useEffect, useRef } from "react";

export default function TabCompetencia() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    import("chart.js/auto").then((mod) => {
      if (cancelled || !chartRef.current) return;
      const Chart = mod.default;
      if (chartInstance.current) (chartInstance.current as { destroy: () => void }).destroy();
      chartInstance.current = new Chart(chartRef.current, {
        type: "bubble",
        data: {
          datasets: [
            { label: "ACL Chile", data: [{ x: 150, y: 30, r: 12 }], backgroundColor: "#ef444480" },
            { label: "Abstracta", data: [{ x: 120, y: 25, r: 14 }], backgroundColor: "#f59e0b80" },
            { label: "Globant", data: [{ x: 200, y: 40, r: 18 }], backgroundColor: "#6b728080" },
            { label: "QA Wolf", data: [{ x: 44, y: 60, r: 10 }], backgroundColor: "#3b82f680" },
            { label: "mabl", data: [{ x: 30, y: 50, r: 10 }], backgroundColor: "#8b5cf680" },
            { label: "Bug0", data: [{ x: 10, y: 70, r: 8 }], backgroundColor: "#10b98180" },
            { label: "LuminQA", data: [{ x: 6, y: 90, r: 16 }], backgroundColor: "#0891b2" },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } },
          scales: {
            x: { title: { display: true, text: "Costo por test (USD)", font: { size: 11 } }, min: 0, max: 220, grid: { color: "#f1f5f9" } },
            y: { title: { display: true, text: "Nivel de autonomía IA", font: { size: 11 } }, min: 0, max: 100, grid: { color: "#f1f5f9" } },
          },
        },
      });
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <div className="section-title">Posicionamiento competitivo en Chile y LATAM</div>
      <div className="section-sub">LuminQA opera en una categoría nueva. Los competidores locales son consultoras de staffing tradicional.</div>

      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>Costos de referencia QA (2025-2026)</h3>
          <table>
            <thead>
              <tr><th>Rol / Servicio</th><th>Chile</th><th>LATAM prom.</th><th>USA</th></tr>
            </thead>
            <tbody>
              <tr><td>QA Tester manual (anual)</td><td>$20K-$28K</td><td>$15K-$25K</td><td>$55K-$80K</td></tr>
              <tr><td>QA Automation Eng. (anual)</td><td>$35K-$47K</td><td>$25K-$42K</td><td>$84K-$140K</td></tr>
              <tr><td>Outsourcing QA (mensual)</td><td>$2.5K-$8K</td><td>$2K-$6K</td><td>$8K-$25K</td></tr>
              <tr><td>Consultoría migración /test</td><td>$100-$180</td><td>$80-$150</td><td>$150-$300</td></tr>
              <tr><td>Tiempo contratación</td><td>3-5 meses</td><td>3-6 meses</td><td>4-6 meses</td></tr>
              <tr className="hl"><td><b>LuminQA /test</b></td><td colSpan={3}><b>$3.49 - $8.99 (incluye on-premise, self-healing, código exportable)</b></td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Mapa de posicionamiento</h3>
          <div className="chart-wrap" style={{ height: 300 }}><canvas ref={chartRef}></canvas></div>
          <div className="note">Eje X: costo por test. Eje Y: nivel de autonomía IA. Tamaño: presencia en LATAM.</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Competencia en Chile y LATAM</h3>
        <table>
          <thead>
            <tr><th>Empresa</th><th>País</th><th>Modelo</th><th>Pricing estimado</th></tr>
          </thead>
          <tbody>
            <tr><td>ACL</td><td>Chile</td><td>Outsourcing QA + IA + Jira</td><td>$3K-$8K/mes staffing</td></tr>
            <tr><td>Tecnova</td><td>Chile</td><td>Servicio QA tradicional</td><td>$2.5K-$6K/mes</td></tr>
            <tr><td>TestGroup</td><td>Chile</td><td>Testing funcional/no funcional</td><td>$2K-$5K/mes</td></tr>
            <tr><td>Verity</td><td>Chile</td><td>QA + capacitación ISTQB</td><td>$2K-$5K/mes</td></tr>
            <tr><td>Abstracta</td><td>Uruguay/Chile</td><td>Testing especializado</td><td>$4K-$12K/mes</td></tr>
            <tr><td>Globant</td><td>Argentina/Chile</td><td>QE Studio + IA</td><td>$8K-$25K/mes</td></tr>
            <tr><td>Softtek</td><td>México/Chile</td><td>Enterprise QE programs</td><td>$10K-$30K/mes</td></tr>
          </tbody>
        </table>
        <div className="note">Ninguno genera automáticamente desde lenguaje natural, ninguno ofrece self-healing con acceso a código fuente, y ninguno opera con modelo de créditos bulk. Son servicios de staffing humano tradicional.</div>
      </div>

      <div className="card">
        <h3>Ventajas competitivas de LuminQA</h3>
        <table>
          <thead>
            <tr><th>Dimensión</th><th>Consultoras LATAM</th><th>Herramientas globales</th><th style={{ background: "var(--accent)", color: "#fff" }}>LuminQA</th></tr>
          </thead>
          <tbody>
            <tr><td>Generación desde código</td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-green">Sí (Git+Jira)</span></td></tr>
            <tr><td>Self-healing profundo</td><td><span className="tag tag-red">Manual</span></td><td><span className="tag tag-amber">DOM/selectores</span></td><td><span className="tag tag-green">IA + commits</span></td></tr>
            <tr><td>On-premise</td><td><span className="tag tag-green">Sí (personas)</span></td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-green">Sí (Edge Server)</span></td></tr>
            <tr><td>Carga masiva 5K tests</td><td>6-12 meses, $175K+</td><td>N/A o $150K+/año</td><td><b>4-6 sem, $36K</b></td></tr>
            <tr><td>Requiere ingenieros</td><td><span className="tag tag-red">Sí (staffing)</span></td><td><span className="tag tag-amber">Depende</span></td><td><span className="tag tag-green">No</span></td></tr>
            <tr><td>Lock-in</td><td><span className="tag tag-green">Bajo</span></td><td><span className="tag tag-red">Alto (mabl)</span></td><td><span className="tag tag-green">Cero</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
