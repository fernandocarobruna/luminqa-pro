"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getLicPrice, fmt } from "@/lib/pricing";

export default function TabProyeccion() {
  const [start, setStart] = useState(2);
  const [growth, setGrowth] = useState(20);
  const [ticket, setTicket] = useState(30);
  const [conv, setConv] = useState(55);
  const [lics, setLics] = useState(5);

  const revChartRef = useRef<HTMLCanvasElement>(null);
  const clientsChartRef = useRef<HTMLCanvasElement>(null);
  const revChart = useRef<unknown>(null);
  const clientsChart = useRef<unknown>(null);

  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const licPrice = getLicPrice(lics);

  let cumClients = 0, mrrClients = 0, cumBulk = 0, cumMRR = 0;
  const bulkArr: number[] = [], mrrArr: number[] = [], clientArr: number[] = [];

  for (let m = 0; m < 12; m++) {
    const nc = Math.round(start * Math.pow(1 + growth / 100, m));
    cumClients += nc;
    clientArr.push(cumClients);
    const bRev = nc * ticket * 1000;
    bulkArr.push(Math.round(bRev / 1000));
    cumBulk += bRev;
    mrrClients += Math.round(nc * conv / 100);
    const mr = mrrClients * lics * licPrice;
    mrrArr.push(Math.round(mr / 1000));
    cumMRR += mr;
  }

  const updateCharts = useCallback(() => {
    import("chart.js/auto").then((mod) => {
      const Chart = mod.default;
      if (revChartRef.current) {
        if (revChart.current) (revChart.current as { destroy: () => void }).destroy();
        revChart.current = new Chart(revChartRef.current, {
          type: "bar",
          data: {
            labels: months,
            datasets: [
              { label: "Bulk", data: bulkArr, backgroundColor: "#3b82f6", borderRadius: 3, stack: "s" },
              { label: "Licencias (MRR)", data: mrrArr, backgroundColor: "#10b981", borderRadius: 3, stack: "s" },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } },
            scales: {
              x: { stacked: true, grid: { display: false }, ticks: { autoSkip: false } },
              y: { stacked: true, ticks: { callback: (v) => "$" + v + "K" }, grid: { color: "#f1f5f9" } },
            },
          },
        });
      }
      if (clientsChartRef.current) {
        if (clientsChart.current) (clientsChart.current as { destroy: () => void }).destroy();
        clientsChart.current = new Chart(clientsChartRef.current, {
          type: "line",
          data: {
            labels: months,
            datasets: [
              { label: "Clientes acumulados", data: clientArr, borderColor: "#0f172a", pointBackgroundColor: "#0f172a", pointRadius: 3, yAxisID: "y", tension: 0.3 },
              { label: "MRR ($K)", data: mrrArr, borderColor: "#10b981", pointBackgroundColor: "#10b981", pointRadius: 3, yAxisID: "y1", tension: 0.3, fill: true, backgroundColor: "#10b98120" },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } },
            scales: {
              x: { grid: { display: false }, ticks: { autoSkip: false } },
              y: { title: { display: true, text: "Clientes", font: { size: 10 } }, grid: { color: "#f1f5f9" } },
              y1: { position: "right", title: { display: true, text: "MRR ($K)", font: { size: 10 } }, grid: { display: false } },
            },
          },
        });
      }
    });
  }, [start, growth, ticket, conv, lics]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { updateCharts(); }, [updateCharts]);

  return (
    <div>
      <div className="section-title">Proyección comercial: potencial de tu operación</div>
      <div className="section-sub">Simula el potencial de revenue como partner de LuminQA en 12 meses.</div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Configura tu escenario</h3>
        <div className="grid g2">
          <div>
            <div className="slider-row">
              <label>Clientes mes 1</label>
              <input type="range" min={1} max={10} value={start} onChange={(e) => setStart(+e.target.value)} />
              <span className="out">{start}</span>
            </div>
            <div className="slider-row">
              <label>Crecimiento mensual (%)</label>
              <input type="range" min={5} max={50} step={5} value={growth} onChange={(e) => setGrowth(+e.target.value)} />
              <span className="out">{growth}%</span>
            </div>
            <div className="slider-row">
              <label>Ticket promedio bulk ($K)</label>
              <input type="range" min={5} max={100} step={5} value={ticket} onChange={(e) => setTicket(+e.target.value)} />
              <span className="out">${ticket}K</span>
            </div>
          </div>
          <div>
            <div className="slider-row">
              <label>% convierte a licencia mensual</label>
              <input type="range" min={20} max={80} step={5} value={conv} onChange={(e) => setConv(+e.target.value)} />
              <span className="out">{conv}%</span>
            </div>
            <div className="slider-row">
              <label>Licencias prom. por cliente</label>
              <input type="range" min={1} max={20} value={lics} onChange={(e) => setLics(+e.target.value)} />
              <span className="out">{lics}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 16 }}>
        <div className="card metric"><div className="val" style={{ color: "var(--navy)" }}>{cumClients}</div><div className="lbl">Clientes año 1</div></div>
        <div className="card metric"><div className="val" style={{ color: "var(--info)" }}>{fmt(cumBulk)}</div><div className="lbl">Revenue bulk</div></div>
        <div className="card metric"><div className="val" style={{ color: "var(--success)" }}>{fmt(mrrArr[11] * 1000)}/mes</div><div className="lbl">Ingreso recurrente mes 12</div></div>
        <div className="card metric"><div className="val" style={{ color: "var(--accent)" }}>{fmt(cumBulk + cumMRR)}</div><div className="lbl">Revenue total año 1</div></div>
      </div>

      <div className="grid g2">
        <div className="card">
          <h3>Revenue mensual proyectado</h3>
          <div className="chart-wrap"><canvas ref={revChartRef}></canvas></div>
        </div>
        <div className="card">
          <h3>Clientes e ingreso recurrente</h3>
          <div className="chart-wrap"><canvas ref={clientsChartRef}></canvas></div>
        </div>
      </div>
    </div>
  );
}
