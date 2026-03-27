"use client";

import { useState, useMemo } from "react";
import { getBulk, getLicPrice, getLicTier, fmt, fmtN } from "@/lib/pricing";

const SAL: Record<string, number> = { cl: 6000, latam: 4500, us: 12000 };
const SAL_LABEL: Record<string, string> = { cl: "Chile ($6K/mes)", latam: "LATAM ($4.5K/mes)", us: "USA ($12K/mes)" };

const BENCHMARKS = [
  { m: "Manual QA", c: 150 }, { m: "Ing. Chile", c: 150 }, { m: "Ing. USA", c: 225 },
  { m: "Selenium", c: 120 }, { m: "Cypress/Playwright", c: 100 }, { m: "Consultora LATAM", c: 130 },
  { m: "QA Wolf", c: 100 }, { m: "Testim / Mabl", c: 80 }, { m: "Bug0 Studio", c: 15 },
  { m: "LuminQA", c: 7.99 },
];

export default function TabROI() {
  const [scenario, setScenario] = useState<"bulk" | "hybrid" | "saas">("saas");
  const [region, setRegion] = useState("cl");
  const [cells, setCells] = useState(3);
  const [qas, setQas] = useState(3);
  const [casesPerCell, setCasesPerCell] = useState(70);
  const [maintenancePct, setMaintenancePct] = useState(35);
  const [qaType, setQaType] = useState("manual");
  const [workModel, setWorkModel] = useState("internal");
  const [regressions, setRegressions] = useState("no");
  const [qaParallel, setQaParallel] = useState("post");
  const [postDevDays, setPostDevDays] = useState(5);
  const [testDepth, setTestDepth] = useState("happy");
  const [bulkCases, setBulkCases] = useState(1000);
  const [cellsPerQA, setCellsPerQA] = useState(3);

  const c = useMemo(() => {
    const salary = SAL[region] ?? 6000;
    const mPct = maintenancePct;
    const isHappy = testDepth === "happy";

    // Current scenario
    const curCasesPerQA = Math.round(casesPerCell * (100 - mPct) / 100);
    const curTotalCases = qas * curCasesPerQA;
    const curMonthlyCost = qas * salary;
    const curMonthlySvc = cells * salary;
    const curCasesTotal = cells * curCasesPerQA;
    const curCostPerCase = curCasesTotal > 0 ? curMonthlySvc / curCasesTotal : 0;

    // LuminQA
    const lumQAs = Math.ceil(cells / cellsPerQA);
    const licenses = Math.ceil((cells * casesPerCell) / 80);
    const licPrice = getLicPrice(licenses);
    const licTier = getLicTier(licenses);
    const lumQASalary = lumQAs * salary;
    const lumLicCost = licenses * licPrice;
    const lumMonthlySvc = lumQASalary + lumLicCost;
    const lumCasesNew = licenses * 80;
    const lumCasesHealing = licenses * 20;
    const lumTotalProd = lumCasesNew + lumCasesHealing;
    const lumCostPerCase = lumCasesNew > 0 ? lumMonthlySvc / lumCasesNew : 0;

    const monthlySaving = curMonthlySvc - lumMonthlySvc;
    const annualSaving = monthlySaving * 12;
    const costPerCaseSaving = curCostPerCase - lumCostPerCase;
    const pctSaving = curMonthlySvc > 0 ? Math.round((monthlySaving / curMonthlySvc) * 100) : 0;

    // Bulk
    const bT = getBulk(bulkCases);
    const curMonthsForBulk = Math.ceil(bulkCases / Math.max(curTotalCases, 1));
    const curCostForBulk = curMonthsForBulk * curMonthlyCost;
    const lumBulkCost = bulkCases * bT.p + bT.con;
    const bulkSaving = curCostForBulk - lumBulkCost;
    const curBulkCPC = bulkCases > 0 ? curCostForBulk / bulkCases : 0;
    const lumBulkCPC = bulkCases > 0 ? lumBulkCost / bulkCases : 0;
    const pctBulk = curCostForBulk > 0 ? Math.round((bulkSaving / curCostForBulk) * 100) : 0;

    const covX = isHappy ? 5 : 3;

    return {
      salary, mPct, isHappy, curCasesPerQA, curTotalCases, curMonthlyCost,
      curMonthlySvc, curCasesTotal, curCostPerCase,
      lumQAs, licenses, licPrice, licTier, lumQASalary, lumLicCost,
      lumMonthlySvc, lumCasesNew, lumCasesHealing, lumTotalProd, lumCostPerCase,
      monthlySaving, annualSaving, costPerCaseSaving, pctSaving,
      bT, curMonthsForBulk, curCostForBulk, lumBulkCost, bulkSaving,
      curBulkCPC, lumBulkCPC, pctBulk, covX,
    };
  }, [region, cells, qas, casesPerCell, maintenancePct, testDepth, bulkCases, cellsPerQA]);

  const fmtF = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div>
      <div className="section-title">Ahorro e impacto economico de LuminQA</div>
      <div className="section-sub">Compara escenarios y demuestra al cliente el ahorro real. Configura las variables y obtiene los numeros.</div>

      {/* Scenario selector */}
      <div className="grid g3" style={{ marginBottom: 16 }}>
        {([
          { key: "bulk" as const, label: "Solo Carga Masiva", desc: "Generacion masiva de casos automatizados" },
          { key: "hybrid" as const, label: "Carga Masiva + Servicio", desc: "Carga inicial + licencias mensuales" },
          { key: "saas" as const, label: "Solo Servicio Mensual", desc: "Licencias mensuales con creditos y self-healing" },
        ]).map((s) => (
          <div
            key={s.key}
            className="card"
            onClick={() => setScenario(s.key)}
            style={{
              cursor: "pointer",
              textAlign: "center",
              border: scenario === s.key ? "2px solid var(--accent)" : undefined,
              background: scenario === s.key ? "var(--accentLight)" : undefined,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--navy)", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Configuration */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Configuracion del escenario</h3>
        <div className="grid g2">
          <div>
            <div className="slider-row">
              <label>Region del cliente</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ flex: 1 }}>
                <option value="cl">{SAL_LABEL.cl}</option>
                <option value="latam">{SAL_LABEL.latam}</option>
                <option value="us">{SAL_LABEL.us}</option>
              </select>
              <span className="out" />
            </div>
            <div className="slider-row">
              <label>Celulas / Equipos</label>
              <input type="range" min={1} max={50} value={cells} onChange={(e) => { setCells(+e.target.value); setQas(+e.target.value); }} />
              <span className="out">{cells}</span>
            </div>
            <div className="slider-row">
              <label>QAs actuales</label>
              <input type="range" min={1} max={100} value={qas} onChange={(e) => setQas(+e.target.value)} />
              <span className="out">{qas}</span>
            </div>
            <div className="slider-row">
              <label>Casos probados por QA/mes</label>
              <input type="range" min={10} max={500} step={10} value={casesPerCell} onChange={(e) => setCasesPerCell(+e.target.value)} />
              <span className="out">{casesPerCell}</span>
            </div>
          </div>
          <div>
            <div className="slider-row">
              <label>Tipo de QA actual</label>
              <select value={qaType} onChange={(e) => setQaType(e.target.value)} style={{ flex: 1 }}>
                <option value="manual">Manual</option>
                <option value="automated">Automatizado</option>
                <option value="mixed">Mixto</option>
              </select>
              <span className="out" />
            </div>
            <div className="slider-row">
              <label>% tiempo en mantencion</label>
              <input type="range" min={0} max={80} value={maintenancePct} onChange={(e) => setMaintenancePct(+e.target.value)} />
              <span className="out">{maintenancePct}%</span>
            </div>
            <div className="slider-row">
              <label>Profundidad de pruebas</label>
              <select value={testDepth} onChange={(e) => setTestDepth(e.target.value)} style={{ flex: 1 }}>
                <option value="happy">Solo Happy Path</option>
                <option value="multi">Multiples combinatorias</option>
              </select>
              <span className="out" />
            </div>
            <div className="slider-row">
              <label title="20% de cada licencia se reserva para Self-Healing: detectar rotura, diagnosticar, reparar definitivamente y validar.">Self-Healing LuminQA</label>
              <span style={{ flex: 1, textAlign: "center", fontWeight: 700, color: "var(--accent)", background: "var(--accentLight)", padding: "6px 10px", borderRadius: 6, fontSize: 13 }}>20% fijo por licencia</span>
              <span className="out" />
            </div>
          </div>
        </div>

        {/* Bulk params */}
        {scenario !== "saas" && (
          <>
            <div className="sep" />
            <h3>Parametros de carga masiva</h3>
            <div className="slider-row">
              <label>Total casos para carga masiva</label>
              <input type="range" min={100} max={50000} step={100} value={bulkCases} onChange={(e) => setBulkCases(+e.target.value)} />
              <span className="out">{fmtN(bulkCases)}</span>
            </div>
            <div className="note">Tier: {fmtN(bulkCases)} casos → ${c.bT.p}/caso + {fmtF(c.bT.con)} consultoria = <b>{fmtF(c.lumBulkCost)}</b> · {c.bT.w}</div>
          </>
        )}

        {/* SaaS params */}
        {scenario !== "bulk" && (
          <>
            <div className="sep" />
            <h3>Parametros del servicio mensual <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>— se autocompletan</span></h3>
            <div className="grid g3" style={{ gap: 12 }}>
              <div className="slider-row" style={{ marginBottom: 0 }}>
                <label style={{ minWidth: 0 }}>Cel. por QA+LuminQA</label>
                <select value={cellsPerQA} onChange={(e) => setCellsPerQA(+e.target.value)} style={{ flex: 1 }}>
                  <option value={3}>3 celulas</option>
                  <option value={4}>4 celulas</option>
                  <option value={5}>5 celulas</option>
                </select>
              </div>
              <div style={{ background: "var(--accentLight)", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>QAs con LuminQA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>{c.lumQAs}</div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>ceil({cells}/{cellsPerQA})</div>
              </div>
              <div style={{ background: "var(--accentLight)", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Licencias LuminQA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>{c.licenses}</div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>ceil({cells}×{casesPerCell}/80)</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Subtitle */}
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
        {cells} celulas · {qas} QAs · {SAL_LABEL[region]} · Produccion: {casesPerCell} casos/mes · Efectiva: {c.curCasesPerQA} (−{c.mPct}% mant.)
      </div>

      {/* KPI Cards */}
      <div className="grid g4" style={{ marginBottom: 16 }}>
        <div className="card metric">
          <div className="val" style={{ color: "var(--success)" }}>
            {scenario === "bulk" ? fmtF(Math.abs(c.bulkSaving)) : fmtF(Math.abs(c.monthlySaving))}
          </div>
          <div className="lbl">{scenario === "bulk" ? "Ahorro Total" : "Ahorro Mensual"}</div>
          {scenario !== "bulk" && <div style={{ fontSize: 14, fontWeight: 700, color: "var(--success)", marginTop: 4 }}>{fmtF(Math.abs(c.annualSaving))} anual</div>}
        </div>
        <div className="card metric">
          <div className="val" style={{ color: c.pctSaving >= 0 ? "var(--success)" : "var(--danger)" }}>
            {scenario === "bulk" ? c.pctBulk : Math.abs(c.pctSaving)}%
          </div>
          <div className="lbl">% Ahorro</div>
        </div>
        <div className="card metric" title={scenario === "bulk"
          ? `Actual: ${fmtF(c.curCostForBulk)} / ${fmtN(bulkCases)} = $${c.curBulkCPC.toFixed(2)}. LuminQA: $${c.bT.p}`
          : `Actual: ${fmtF(c.curMonthlySvc)} / ${c.curCasesTotal} = $${c.curCostPerCase.toFixed(2)}. LuminQA: ${fmtF(c.lumMonthlySvc)} / ${c.lumCasesNew} = $${c.lumCostPerCase.toFixed(2)}`
        }>
          <div className="val" style={{ color: "var(--accent)" }}>
            ${scenario === "bulk" ? c.bT.p : c.lumCostPerCase.toFixed(2)}
          </div>
          <div className="lbl">Costo por Caso</div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
            Actual ${scenario === "bulk" ? c.curBulkCPC.toFixed(2) : c.curCostPerCase.toFixed(2)}
          </div>
        </div>
        <div className="card metric" title={c.isHappy
          ? "Happy path = 1 flujo. LuminQA genera ~5 combinatorias por funcionalidad."
          : "LuminQA agrega ~3x mas variantes desde contexto multi-fuente."
        }>
          <div className="val" style={{ color: "var(--warn)" }}>{c.covX}x</div>
          <div className="lbl">Cobertura</div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
            {c.isHappy ? "Happy path → combinatorias IA" : "Profundidad aumentada"}
          </div>
        </div>
      </div>

      {/* Comparison boxes */}
      {scenario === "bulk" && <BulkComp c={c} bulkCases={bulkCases} fmtF={fmtF} />}
      {scenario === "hybrid" && (
        <>
          <div className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>1. Comparacion Servicio Mensual</div>
          <SvcComp c={c} fmtF={fmtF} />
          <div className="section-title" style={{ fontSize: 14, marginBottom: 8, marginTop: 16 }}>2. Comparacion Carga Masiva ({fmtN(bulkCases)} casos)</div>
          <BulkComp c={c} bulkCases={bulkCases} fmtF={fmtF} />
        </>
      )}
      {scenario === "saas" && <SvcComp c={c} fmtF={fmtF} />}

      {/* Detail table */}
      <DetailTable c={c} scenario={scenario} bulkCases={bulkCases} cellsPerQA={cellsPerQA} fmtF={fmtF} />

      {/* Benchmark */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Costo por Test Case — Benchmark</h3>
        {BENCHMARKS.map((b) => {
          const mx = 225;
          const w = Math.max((b.c / mx) * 100, 3);
          const isL = b.m === "LuminQA";
          return (
            <div key={b.m} style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 6,
              background: isL ? "var(--accentLight)" : undefined,
              margin: isL ? "0 -12px 6px" : undefined,
              padding: isL ? "6px 12px" : undefined,
              borderRadius: isL ? 8 : undefined,
              border: isL ? "2px solid var(--accent)" : undefined,
            }}>
              <span style={{ width: 130, textAlign: "right", fontSize: 12, fontWeight: isL ? 800 : 500, color: isL ? "var(--navy)" : "var(--muted)", flexShrink: 0 }}>{b.m}</span>
              <div style={{ flex: 1, height: 24, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  width: `${w}%`, height: "100%", borderRadius: 4,
                  background: isL ? "linear-gradient(90deg, var(--accent), var(--accent2))" : "#94a3b8",
                  display: "flex", alignItems: "center", paddingLeft: 8,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isL ? "var(--navy)" : "#fff", whiteSpace: "nowrap" }}>${b.c}{isL ? " ✓" : ""}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function CompRow({ label, value, tip }: { label: string; value: string; tip?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }} title={tip}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SvcComp({ c, fmtF }: { c: any; fmtF: (n: number) => string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 50px 1fr", gap: 0, marginBottom: 16, alignItems: "stretch" }}>
      <div className="card" style={{ borderWidth: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)", marginBottom: 4 }}>Escenario Actual</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "var(--navy)", letterSpacing: -1 }}>{fmtF(c.curMonthlySvc)}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>costo mensual servicio QA</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          <CompRow label={`${Math.round(c.curMonthlySvc / c.salary)} celulas × 1 QA c/u`} value={`${Math.round(c.curMonthlySvc / c.salary)} QAs`} />
          <CompRow label={`${Math.round(c.curMonthlySvc / c.salary)} QAs × ${fmtF(c.salary)}/mes`} value={`${fmtF(c.curMonthlySvc)}/mes`} />
          <CompRow label={`Produccion por QA (−${c.mPct}% mant.)`} value={`${c.curCasesPerQA} casos/mes`} tip={`${c.curCasesPerQA} = casesPerCell × (100−${c.mPct})%`} />
          <CompRow label="Produccion total" value={`${c.curCasesTotal} casos/mes`} />
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontWeight: 700, fontSize: 12 }} title={`${fmtF(c.curMonthlySvc)} / ${c.curCasesTotal} = $${c.curCostPerCase.toFixed(2)}`}>
            <span>Costo por caso</span><span>${c.curCostPerCase.toFixed(2)}</span>
          </div>
          <CompRow label="Costo anual (× 12)" value={fmtF(c.curMonthlySvc * 12)} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--muted)", fontSize: 13 }}>VS</div>
      <div className="card" style={{ background: "var(--navy)", color: "#fff", border: "2px solid var(--accent)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--accent)", marginBottom: 4 }}>Con LuminQA</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)", letterSpacing: -1 }}>{fmtF(c.lumMonthlySvc)}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>costo mensual (QA + licencias)</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          <CompRow label={`${c.lumQAs} QA × ${Math.ceil(c.curMonthlySvc / c.salary / c.lumQAs)} cel c/u`} value={`${fmtF(c.lumQASalary)}/mes`} />
          <CompRow label={`${c.licenses} lic. ${c.licTier} × $${c.licPrice}`} value={`${fmtF(c.lumLicCost)}/mes`} />
          <CompRow label={`Casos nuevos (${c.licenses} × 80)`} value={`${c.lumCasesNew} casos/mes`} />
          <CompRow label={`Casos reparados (${c.licenses} × 20)`} value={`${c.lumCasesHealing} casos/mes`} />
          <CompRow label="Produccion total" value={`${c.lumTotalProd} casos/mes`} />
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontWeight: 700, fontSize: 12 }} title={`${fmtF(c.lumMonthlySvc)} / ${c.lumCasesNew} = $${c.lumCostPerCase.toFixed(2)}`}>
            <span>Costo por caso nuevo</span><span>${c.lumCostPerCase.toFixed(2)}</span>
          </div>
          <CompRow label="Mantencion" value="0% — Self-Healing" />
          <CompRow label="Costo anual (× 12)" value={fmtF(c.lumMonthlySvc * 12)} />
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BulkComp({ c, bulkCases, fmtF }: { c: any; bulkCases: number; fmtF: (n: number) => string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 50px 1fr", gap: 0, marginBottom: 16, alignItems: "stretch" }}>
      <div className="card" style={{ borderWidth: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)", marginBottom: 4 }}>Escenario Actual</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "var(--navy)", letterSpacing: -1 }}>{fmtF(c.curCostForBulk)}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>costo total para {fmtN(bulkCases)} casos</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          <CompRow label={`${Math.round(c.curMonthlyCost / c.salary)} QAs × ${fmtF(c.salary)}/mes`} value={`${fmtF(c.curMonthlyCost)}/mes`} />
          <CompRow label="Produccion efectiva" value={`${c.curTotalCases} casos/mes`} />
          <CompRow label={`Produccion por QA (−${c.mPct}% mant.)`} value={`${c.curCasesPerQA} casos/mes`} />
          <CompRow label={`Tiempo para ${fmtN(bulkCases)} casos`} value={`${c.curMonthsForBulk} meses`} />
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontWeight: 700, fontSize: 12 }}>
            <span>Costo total</span><span>{fmtF(c.curCostForBulk)}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--muted)", fontSize: 13 }}>VS</div>
      <div className="card" style={{ background: "var(--navy)", color: "#fff", border: "2px solid var(--accent)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--accent)", marginBottom: 4 }}>Con LuminQA</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)", letterSpacing: -1 }}>{fmtF(c.lumBulkCost)}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>inversion unica · {c.bT.w}</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          <CompRow label={`${fmtN(bulkCases)} casos × $${c.bT.p}`} value={fmtF(bulkCases * c.bT.p)} />
          <CompRow label="Consultoria incluida" value={fmtF(c.bT.con)} />
          <CompRow label="Entrega" value={c.bT.w} />
          <CompRow label="Mantencion incluida" value="Self-Healing IA" />
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DetailTable({ c, scenario, bulkCases, cellsPerQA, fmtF }: { c: any; scenario: string; bulkCases: number; cellsPerQA: number; fmtF: (n: number) => string }) {
  type Row = { dim: string; cur: string; lum: string; diff: string; pos: boolean };
  let rows: Row[] = [];

  if (scenario === "bulk") {
    rows = [
      { dim: "Costo total", cur: fmtF(c.curCostForBulk), lum: fmtF(c.lumBulkCost), diff: `${fmt(Math.abs(c.bulkSaving))} ahorro`, pos: c.bulkSaving >= 0 },
      { dim: "Tiempo", cur: `${c.curMonthsForBulk} meses`, lum: c.bT.w, diff: `${c.curMonthsForBulk - Math.ceil(parseInt(c.bT.w) / 4)} meses menos`, pos: true },
      { dim: "Costo por caso", cur: `$${c.curBulkCPC.toFixed(2)}`, lum: `$${c.bT.p}`, diff: `$${(c.curBulkCPC - c.bT.p).toFixed(2)} menos`, pos: true },
      { dim: "Mantencion", cur: `${c.mPct}% del equipo`, lum: "0% — Self-Healing", diff: `${c.mPct}% liberado`, pos: true },
      { dim: "Profundidad", cur: c.isHappy ? "Solo Happy Path" : "Combinatorias limitadas", lum: "Combinatorias IA multi-fuente", diff: `${c.covX}x cobertura`, pos: true },
      { dim: "Capacidad por QA", cur: "1 QA = 1 celula", lum: `1 QA + LuminQA = ${cellsPerQA} cel`, diff: `${cellsPerQA}x capacidad`, pos: true },
    ];
  } else {
    rows = [
      { dim: "Costo mensual", cur: fmtF(c.curMonthlySvc), lum: fmtF(c.lumMonthlySvc), diff: `${fmt(Math.abs(c.monthlySaving))} ahorro/mes`, pos: c.monthlySaving >= 0 },
      { dim: "Costo por caso", cur: `$${c.curCostPerCase.toFixed(2)}`, lum: `$${c.lumCostPerCase.toFixed(2)}`, diff: `$${c.costPerCaseSaving.toFixed(2)} menos`, pos: c.costPerCaseSaving > 0 },
      { dim: "Costo anual", cur: fmtF(c.curMonthlySvc * 12), lum: fmtF(c.lumMonthlySvc * 12), diff: `${fmtF(Math.abs(c.annualSaving))} ahorro`, pos: c.annualSaving >= 0 },
      { dim: "QAs necesarios", cur: `${Math.round(c.curMonthlySvc / c.salary)} QA`, lum: `${c.lumQAs} QA`, diff: `${Math.round(c.curMonthlySvc / c.salary) - c.lumQAs} menos`, pos: true },
      { dim: "Produccion", cur: `${c.curCasesTotal} casos`, lum: `${c.lumTotalProd} casos`, diff: `${c.curCasesTotal > 0 ? (c.lumTotalProd / c.curCasesTotal).toFixed(1) : 0}x mas`, pos: true },
      { dim: "Mantencion", cur: `${c.mPct}% del equipo`, lum: "0% — Self-Healing", diff: `${c.mPct}% liberado`, pos: true },
      { dim: "Profundidad", cur: c.isHappy ? "Solo Happy Path" : "Combinatorias limitadas", lum: "Combinatorias IA multi-fuente", diff: `${c.covX}x cobertura`, pos: true },
      { dim: "Capacidad por QA", cur: "1 QA = 1 celula", lum: `1 QA + LuminQA = ${cellsPerQA} cel`, diff: `${cellsPerQA}x capacidad`, pos: true },
    ];
    if (scenario === "hybrid") {
      rows.splice(3, 0,
        { dim: "Carga masiva", cur: `${fmtF(c.curCostForBulk)} (${c.curMonthsForBulk}m)`, lum: `${fmtF(c.lumBulkCost)} (${c.bT.w})`, diff: `${fmtF(Math.abs(c.bulkSaving))} ahorro`, pos: c.bulkSaving >= 0 },
        { dim: "Costo/caso bulk", cur: `$${c.curBulkCPC.toFixed(2)}`, lum: `$${c.lumBulkCPC.toFixed(2)}`, diff: `$${(c.curBulkCPC - c.lumBulkCPC).toFixed(2)} menos`, pos: c.curBulkCPC > c.lumBulkCPC },
      );
    }
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3>Detalle comparativo</h3>
      <table>
        <thead>
          <tr><th style={{ width: "28%" }}>Dimension</th><th style={{ width: "26%" }}>Escenario Actual</th><th style={{ width: "26%" }}>Con LuminQA</th><th style={{ width: "20%" }}>Diferencia</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{r.dim}</td>
              <td>{r.cur}</td>
              <td style={{ color: "var(--accent)", fontWeight: 500 }}>{r.lum}</td>
              <td style={{ fontWeight: 600, color: r.pos ? "var(--success)" : "var(--danger)" }}>
                {r.pos ? "▲" : "▼"} {r.diff}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
