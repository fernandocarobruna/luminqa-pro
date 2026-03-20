"use client";

export default function TabModelos() {
  return (
    <div>
      <div className="section-title">Tres modelos de venta para carga masiva</div>
      <div className="section-sub">Ofrece las tres opciones al cliente. Cada una atiende un perfil y necesidad diferente.</div>

      <div className="grid g3" style={{ marginBottom: 20 }}>
        <div className="card model-card">
          <span className="tag tag-blue" style={{ marginBottom: 10 }}>Modelo A — Bulk standalone</span>
          <h3 style={{ marginTop: 8 }}>Pago único, sin suscripción</h3>
          <div className="sep"></div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            El cliente paga one-shot por la migración/creación de tests. Recibe scripts Playwright 100% exportables. No incluye self-healing ni regresión nocturna posterior.
          </p>
          <table style={{ fontSize: 12 }}>
            <tbody>
              <tr><td>Consultoría</td><td><span className="tag tag-green">Incluida</span></td></tr>
              <tr><td>Self-healing post-entrega</td><td><span className="tag tag-red">No incluido</span></td></tr>
              <tr><td>Regresión nocturna</td><td><span className="tag tag-red">No incluida</span></td></tr>
              <tr><td>Código exportable</td><td><span className="tag tag-green">Sí, 100%</span></td></tr>
              <tr><td>Lock-in</td><td><span className="tag tag-green">Cero</span></td></tr>
            </tbody>
          </table>
          <div className="note">Ideal para: empresas que solo quieren resolver su deuda técnica y manejar la suite internamente. Excelente como puerta de entrada — muchos clientes contratan licencias después de ver los resultados.</div>
        </div>

        <div className="card model-card rec">
          <div className="badge-card">RECOMENDADO</div>
          <span className="tag tag-green" style={{ marginBottom: 10 }}>Modelo B — Bulk + suscripción</span>
          <h3 style={{ marginTop: 8 }}>Migración + servicio continuo</h3>
          <div className="sep"></div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            Carga masiva con descuento 10-15% + 6-12 meses de suscripción LuminQA. Self-healing y regresión nocturna desde el día 1. El cliente automatiza todo Y lo mantiene vivo.
          </p>
          <table style={{ fontSize: 12 }}>
            <tbody>
              <tr><td>Consultoría</td><td><span className="tag tag-green">Incluida + onboarding</span></td></tr>
              <tr><td>Self-healing post-entrega</td><td><span className="tag tag-green">Incluido</span></td></tr>
              <tr><td>Regresión nocturna</td><td><span className="tag tag-green">Incluida</span></td></tr>
              <tr><td>Descuento en bulk</td><td><span className="tag tag-green">10-15%</span></td></tr>
              <tr><td>Lock-in</td><td><span className="tag tag-green">Cero</span></td></tr>
            </tbody>
          </table>
          <div className="note">Ideal para: la mayoría de los clientes. Obtienen el máximo valor: automatizan la deuda técnica Y mantienen la suite funcionando. El argumento: &quot;automatiza todo y que funcione para siempre&quot;.</div>
        </div>

        <div className="card model-card">
          <span className="tag tag-purple" style={{ marginBottom: 10 }}>Modelo C — Suscripción enterprise</span>
          <h3 style={{ marginTop: 8 }}>Créditos elevados, absorbe el bulk</h3>
          <div className="sep"></div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            Suscripción mensual con pool de 500-2,000 créditos/mes. La migración se ejecuta progresivamente en 3-6 meses. Sin pago one-shot. 100% OPEX predecible.
          </p>
          <table style={{ fontSize: 12 }}>
            <tbody>
              <tr><td>Consultoría</td><td><span className="tag tag-green">Trimestral incluida</span></td></tr>
              <tr><td>Self-healing</td><td><span className="tag tag-green">Incluido</span></td></tr>
              <tr><td>Regresión nocturna</td><td><span className="tag tag-green">Incluida</span></td></tr>
              <tr><td>Precio rango</td><td>$3,500-$12,000/mes</td></tr>
              <tr><td>Compromiso</td><td>12 meses</td></tr>
            </tbody>
          </table>
          <div className="note">Ideal para: empresas enterprise que prefieren OPEX predecible, o donde procurement no aprueba pagos one-shot grandes. La migración ocurre &quot;orgánicamente&quot; mes a mes.</div>
        </div>
      </div>

      <div className="card">
        <h3>¿Cuál modelo recomendar?</h3>
        <table>
          <thead>
            <tr><th>Si el cliente dice...</th><th>Recomendar</th><th>Por qué</th></tr>
          </thead>
          <tbody>
            <tr><td>&quot;Solo quiero limpiar nuestra deuda técnica&quot;</td><td><span className="tag tag-blue">Modelo A</span></td><td>Resuelve el problema puntual. Sin compromiso. Código exportable.</td></tr>
            <tr><td>&quot;Quiero automatizar y que funcione para siempre&quot;</td><td><span className="tag tag-green">Modelo B</span></td><td>Bulk + servicio. Self-healing y regresión nocturna mantienen la suite viva.</td></tr>
            <tr><td>&quot;Necesitamos presupuesto mensual predecible&quot;</td><td><span className="tag tag-purple">Modelo C</span></td><td>Todo como OPEX. Sin aprobaciones de CAPEX. Procurement-friendly.</td></tr>
            <tr><td>&quot;Estamos evaluando QA Wolf&quot;</td><td><span className="tag tag-green">Modelo B</span></td><td>Misma cobertura, 70%+ más barato, on-premise, sin dependencia externa.</td></tr>
            <tr><td>&quot;Ya tenemos mabl/Selenium/Cypress roto&quot;</td><td><span className="tag tag-blue">Modelo A</span> o <span className="tag tag-green">B</span></td><td>Migración rápida. El código que ya tienen no se pierde, se transforma.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
