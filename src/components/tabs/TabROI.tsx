"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getBulk, fmt, fmtN } from "@/lib/pricing";

export default function TabROI() {
  const [cases, setCases] = useState(3000);
  const [region, setRegion] = useState("cl");
  const [teams, setTeams] = useState(8);
  const [defects, setDefects] = useState(15);
  const [defectCost, setDefectCost] = useState(10000);
  const [cycle, setCycle] = useState(3);

  const timeChartRef = useRef<HTMLCanvasElement>(null);
  const costChartRef = useRef<HTMLCanvasElement>(null);
  const timeChart = useRef<unknown>(null);
  const costChart = useRef<unknown>(null);

  const sal = { cl: 35000, latam: 28000, us: 112000 }[region] ?? 35000;
  const prodPerMonth = 30;
  const engsNeeded = Math.max(1, Math.ceil(cases / prodPerMonth / 12));
  const monthsEng = Math.ceil(cases / prodPerMonth) + 4;
  const costEng = engsNeeded * sal * Math.min(monthsEng / 12, 3);
  const consultCost = cases * (region === "us" ? 225 : region === "cl" ? 150 : 120);
  const b = getBulk(cases);
  const lumTotal = cases * b.p + b.con;
  const lumWeeksNum = parseInt(b.w);
  const savingsEng = Math.max(0, costEng - lumTotal);
  const savingsConsult = Math.max(0, consultCost - lumTotal);
  const defectsAvoided = Math.round(defects * 0.75) * 12;
  const savingsDefects = defectsAvoided * defectCost;
  const savingsMaint = cases > 300 ? Math.round(cases * 0.3 * 50 * 12) : 0;
  const totalROI = savingsEng + savingsDefects + savingsMaint;
  const roiMultiple = lumTotal > 0 ? (totalROI / lumTotal).toFixed(0) : "0";
  const ahorroVsEng = costEng > 0 ? Math.round((1 - lumTotal / costEng) * 100) : 0;

  const updateCharts = useCallback(() => {
    import("chart.js/auto").then((mod) => {
      const Chart = mod.default;
      if (timeChartRef.current) {
        if (timeChart.current) (timeChart.current as { destroy: () => void }).destroy();
        timeChart.current = new Chart(timeChartRef.current, {
          type: "bar",
          data: {
            labels: ["Ing. automation", "Consultoría", "LuminQA"],
            datasets: [{
              data: [monthsEng, Math.ceil(cases / 200), Math.max(1, Math.ceil(lumWeeksNum / 4.3))],
              backgroundColor: ["#ef4444", "#f59e0b", "#0891b2"],
              borderRadius: 4,
            }],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.raw + " meses" } } },
            scales: { x: { title: { display: true, text: "Meses" }, grid: { color: "#f1f5f9" } }, y: { grid: { display: false } } },
          },
        });
      }
      if (costChartRef.current) {
        if (costChart.current) (costChart.current as { destroy: () => void }).destroy();
        costChart.current = new Chart(costChartRef.current, {
          type: "bar",
          data: {
            labels: ["Ing. automation", "Consultoría", "LuminQA"],
            datasets: [{
              data: [Math.round(costEng / 1000), Math.round(consultCost / 1000), Math.round(lumTotal / 1000)],
              backgroundColor: ["#ef4444", "#f59e0b", "#0891b2"],
              borderRadius: 4,
            }],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => "$" + ctx.raw + "K" } } },
            scales: { x: { title: { display: true, text: "USD (miles)" }, ticks: { callback: (v) => "$" + v + "K" }, grid: { color: "#f1f5f9" } }, y: { grid: { display: false } } },
          },
        });
      }
    });
  }, [cases, monthsEng, lumWeeksNum, costEng, consultCost, lumTotal]);

  useEffect(() => { updateCharts(); }, [updateCharts]);

  return (
    <div>
      <div className="section-title">Simulador de ROI para el cliente</div>
      <div className="section-sub">Muestra este cálculo al cliente para demostrar el valor. Configura el escenario y obtén los números.</div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Escenario del cliente</h3>
        <div className="grid g2">
          <div>
            <div className="slider-row">
              <label>Casos a automatizar</label>
              <input type="range" min={100} max={50000} step={100} value={cases} onChange={(e) => setCases(+e.target.value)} />
              <span className="out">{fmtN(cases)}</span>
            </div>
            <div className="slider-row">
              <label>Región del cliente</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ flex: 1 }}>
                <option value="cl">Chile (Ing. QA $35K/año)</option>
                <option value="latam">LATAM promedio ($28K/año)</option>
                <option value="us">USA ($112K/año)</option>
              </select>
              <span className="out"></span>
            </div>
            <div className="slider-row">
              <label>Equipos de desarrollo</label>
              <input type="range" min={1} max={30} value={teams} onChange={(e) => setTeams(+e.target.value)} />
              <span className="out">{teams}</span>
            </div>
          </div>
          <div>
            <div className="slider-row">
              <label>Defectos en producción/mes</label>
              <input type="range" min={1} max={50} value={defects} onChange={(e) => setDefects(+e.target.value)} />
              <span className="out">{defects}</span>
            </div>
            <div className="slider-row">
              <label>Costo por defecto (USD)</label>
              <input type="range" min={1000} max={50000} step={1000} value={defectCost} onChange={(e) => setDefectCost(+e.target.value)} />
              <span className="out">${fmtN(defectCost)}</span>
            </div>
            <div className="slider-row">
              <label>Ciclo QA actual (semanas)</label>
              <input type="range" min={1} max={8} value={cycle} onChange={(e) => setCycle(+e.target.value)} />
              <span className="out">{cycle} semanas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 16 }}>
        <div className="card metric"><div className="val" style={{ color: "var(--accent)" }}>{fmt(lumTotal)}</div><div className="lbl">Inversión LuminQA</div></div>
        <div className="card metric"><div className="val" style={{ color: "var(--danger)" }}>{fmt(costEng)}</div><div className="lbl">Costo tradicional</div></div>
        <div className="card metric"><div className="val" style={{ color: "var(--success)" }}>{ahorroVsEng}%</div><div className="lbl">Ahorro</div></div>
        <div className="card metric"><div className="val" style={{ color: "var(--purple)" }}>{roiMultiple}x</div><div className="lbl">ROI año 1</div></div>
      </div>

      <div className="grid g2" style={{ marginBottom: 16 }}>
        <div className="card">
          <h3>Comparativa de tiempos</h3>
          <div className="chart-wrap" style={{ height: 260 }}><canvas ref={timeChartRef}></canvas></div>
        </div>
        <div className="card">
          <h3>Comparativa de costos</h3>
          <div className="chart-wrap" style={{ height: 260 }}><canvas ref={costChartRef}></canvas></div>
        </div>
      </div>

      <div className="card">
        <h3>Desglose del ROI para el cliente (año 1)</h3>
        <table>
          <thead><tr><th>Concepto</th><th>Valor</th></tr></thead>
          <tbody>
            <tr><td>Inversión LuminQA (carga masiva)</td><td><b>{fmt(lumTotal)}</b></td></tr>
            <tr><td>Ahorro vs. contratar ingenieros internos ({engsNeeded} ing × {monthsEng} meses)</td><td style={{ color: "var(--success)" }}>{fmt(savingsEng)}</td></tr>
            <tr><td>Ahorro vs. consultoría tradicional</td><td style={{ color: "var(--success)" }}>{fmt(savingsConsult)}</td></tr>
            <tr><td>Defectos evitados/año ({defectsAvoided} × ${fmtN(defectCost)})</td><td style={{ color: "var(--success)" }}>{fmt(savingsDefects)}</td></tr>
            <tr><td>Ahorro en mantenimiento de scripts/año</td><td style={{ color: "var(--success)" }}>{fmt(savingsMaint)}</td></tr>
            <tr><td>Tiempo ahorrado: {monthsEng} meses → {b.w}</td><td style={{ color: "var(--success)" }}>{monthsEng - Math.ceil(lumWeeksNum / 4.3)} meses</td></tr>
            <tr style={{ background: "var(--accentLight)" }}><td><b>ROI total estimado año 1</b></td><td style={{ color: "var(--accent)", fontSize: 18, fontWeight: 700 }}>{fmt(totalROI)}</td></tr>
            <tr><td><b>Retorno sobre la inversión</b></td><td style={{ color: "var(--accent)", fontWeight: 700 }}>{roiMultiple}x</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
