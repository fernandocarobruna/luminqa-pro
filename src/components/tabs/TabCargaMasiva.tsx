"use client";

import { useState, useEffect, useRef } from "react";
import { getBulk, fmtN } from "@/lib/pricing";

export default function TabCargaMasiva() {
  const [cases, setCases] = useState(5000);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<unknown>(null);

  const b = getBulk(cases);
  const total = Math.round(cases * b.p + b.con);

  useEffect(() => {
    let cancelled = false;
    import("chart.js/auto").then((mod) => {
      if (cancelled || !chartRef.current) return;
      const Chart = mod.default;
      if (chartInstance.current) (chartInstance.current as { destroy: () => void }).destroy();
      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: ["500", "1K", "2.5K", "5K", "10K", "25K", "50K"],
          datasets: [
            {
              data: [8.99, 7.99, 6.99, 5.99, 4.99, 3.99, 3.49],
              backgroundColor: "#0891b2",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: {
              title: { display: true, text: "USD/crédito", font: { size: 11 } },
              min: 0,
              max: 12,
              grid: { color: "#f1f5f9" },
            },
          },
        },
      });
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <div className="section-title">
        Servicio de carga masiva: automatización de deuda técnica
      </div>
      <div className="section-sub">
        Para clientes con miles de casos manuales o suites automatizadas rotas.
        Precio por crédito decreciente por volumen. Incluye consultoría de
        análisis y migración.
      </div>

      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>Bandas de precio por volumen</h3>
          <table>
            <thead>
              <tr>
                <th>Tramo</th>
                <th>Precio/crédito</th>
                <th>Consultoría incluida</th>
                <th>Total estimado</th>
                <th>Entrega</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><b>500</b></td><td>$8.99</td><td>$1,500</td><td>$5,995</td><td>1-2 sem</td></tr>
              <tr><td><b>1,000</b></td><td>$7.99</td><td>$2,500</td><td>$10,490</td><td>2-3 sem</td></tr>
              <tr className="hl"><td><b>2,500</b></td><td>$6.99</td><td>$4,000</td><td>$21,475</td><td>3-4 sem</td></tr>
              <tr className="hl"><td><b>5,000</b></td><td>$5.99</td><td>$6,500</td><td>$36,450</td><td>4-6 sem</td></tr>
              <tr><td><b>10,000</b></td><td>$4.99</td><td>$10,000</td><td>$59,900</td><td>6-8 sem</td></tr>
              <tr><td><b>25,000</b></td><td>$3.99</td><td>$18,000</td><td>$117,750</td><td>10-12 sem</td></tr>
              <tr><td><b>50,000</b></td><td>$3.49</td><td>$30,000</td><td>$204,500</td><td>14-18 sem</td></tr>
            </tbody>
          </table>
          <div className="note">
            Consultoría incluye: análisis de suite existente, mapeo de
            dependencias, priorización por criticidad, plan de migración y
            validación post-generación. Aplica tanto para crear tests nuevos
            desde casos manuales como para reparar/migrar tests automatizados
            existentes.
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3>Precio por crédito según volumen</h3>
            <div className="chart-wrap" style={{ height: 250 }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
          <div className="card">
            <h3>Simulador rápido de carga masiva</h3>
            <div className="slider-row">
              <label>Cantidad de casos</label>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={cases}
                onChange={(e) => setCases(+e.target.value)}
              />
              <span className="out">{fmtN(cases)}</span>
            </div>
            <div className="grid g3" style={{ marginTop: 8 }}>
              <div style={{ background: "var(--accentLight)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--accent2)" }}>Precio/crédito</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)" }}>${b.p.toFixed(2)}</div>
              </div>
              <div style={{ background: "var(--accentLight)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--accent2)" }}>Consultoría</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)" }}>${fmtN(b.con)}</div>
              </div>
              <div style={{ background: "var(--accentLight)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--accent2)" }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>${fmtN(total)}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
              Tiempo estimado de entrega: {b.w}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
