"use client";

import { useEffect, useRef } from "react";

export default function TabBenchmark() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    import("chart.js/auto").then((mod) => {
      if (cancelled || !chartRef.current) return;
      const Chart = mod.default;
      if (chartInstance.current) (chartInstance.current as { destroy: () => void }).destroy();
      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: ["1,000 tests", "5,000 tests", "10,000 tests"],
          datasets: [
            { label: "Ing. Chile (8-14 meses)", data: [97, 485, 970], backgroundColor: "#ef4444", borderRadius: 3 },
            { label: "Consultoría trad.", data: [150, 750, 1500], backgroundColor: "#f59e0b", borderRadius: 3 },
            { label: "QA Wolf (1 año)", data: [528, 2640, 5280], backgroundColor: "#6b7280", borderRadius: 3 },
            { label: "LuminQA", data: [10, 36, 60], backgroundColor: "#0891b2", borderRadius: 3 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } },
            tooltip: { callbacks: { label: (ctx) => ctx.dataset.label + ": $" + ctx.raw + "K" } },
          },
          scales: {
            x: { grid: { display: false } },
            y: { ticks: { callback: (v) => "$" + v + "K" }, grid: { color: "#f1f5f9" } },
          },
        },
      });
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <div className="section-title">Benchmark de mercado: LuminQA vs. alternativas</div>
      <div className="section-sub">Comparativa para que el partner argumente frente al cliente. Datos de mercado 2025-2026.</div>

      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>Costo por test según método/proveedor</h3>
          <table>
            <thead>
              <tr><th>Método</th><th>Costo/test</th><th>Mantención</th><th>Tiempo 1K tests</th><th>On-premise</th></tr>
            </thead>
            <tbody>
              <tr><td>Ing. automation Chile</td><td>$97-$194</td><td><span className="tag tag-red">No</span></td><td>8-14 meses</td><td><span className="tag tag-green">Sí</span></td></tr>
              <tr><td>Ing. automation USA</td><td>$311-$622</td><td><span className="tag tag-red">No</span></td><td>8-14 meses</td><td><span className="tag tag-green">Sí</span></td></tr>
              <tr><td>Consultoría tradicional</td><td>$120-$225</td><td><span className="tag tag-red">No</span></td><td>3-6 meses</td><td><span className="tag tag-green">Sí</span></td></tr>
              <tr><td>QA Wolf (USA)</td><td>$44/mes recurrente</td><td><span className="tag tag-green">Sí</span></td><td>4 meses</td><td><span className="tag tag-red">No</span></td></tr>
              <tr><td>Bug0 Studio</td><td>$3-$6 generación</td><td><span className="tag tag-amber">Parcial</span></td><td>2-4 semanas</td><td><span className="tag tag-red">No</span></td></tr>
              <tr><td>Bug0 Managed</td><td>$2.5K-$5K/mes</td><td><span className="tag tag-green">Sí</span></td><td>1-4 semanas</td><td><span className="tag tag-red">No</span></td></tr>
              <tr className="hl"><td><b>LuminQA</b></td><td><b>$3.49-$8.99</b></td><td><span className="tag tag-green"><b>Sí</b></span></td><td><b>1-18 sem</b></td><td><span className="tag tag-green"><b>Sí</b></span></td></tr>
            </tbody>
          </table>
          <div className="note">LuminQA es la única solución que combina generación desde código fuente, self-healing profundo, on-premise y código 100% exportable.</div>
        </div>
        <div className="card">
          <h3>Costo total para automatizar N tests (USD miles)</h3>
          <div className="chart-wrap" style={{ height: 300 }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Comparativa de funcionalidades</h3>
        <table>
          <thead>
            <tr><th>Funcionalidad</th><th>QA Wolf</th><th>mabl</th><th>Bug0</th><th style={{ background: "var(--accent)", color: "#fff" }}>LUMINQA</th></tr>
          </thead>
          <tbody>
            <tr><td>Tipo de solución</td><td>Servicio gestionado</td><td>SaaS (cliente opera)</td><td>Plataforma + servicio</td><td className="hl">Agente IA autónomo</td></tr>
            <tr><td>Genera desde código fuente</td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-green">Sí (Git + Jira)</span></td></tr>
            <tr><td>Self-healing</td><td>Manual (ellos)</td><td>DOM/selectores</td><td>Playwright básico</td><td className="hl">IA + código fuente</td></tr>
            <tr><td>On-premise</td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-green">Sí (Edge Server)</span></td></tr>
            <tr><td>Requiere ing. automation</td><td>No</td><td><span className="tag tag-red">Sí ($60-140K)</span></td><td>Parcial</td><td><span className="tag tag-green">No</span></td></tr>
            <tr><td>Código exportable</td><td><span className="tag tag-green">Sí</span></td><td><span className="tag tag-red">No (lock-in)</span></td><td><span className="tag tag-green">Sí</span></td><td><span className="tag tag-green">Sí (Playwright)</span></td></tr>
            <tr><td>Sugerencias proactivas IA</td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-red">No</span></td><td><span className="tag tag-green">Sí</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
