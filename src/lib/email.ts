import { Resend } from "resend";

function getResend() { if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not set"); return new Resend(process.env.RESEND_API_KEY); }

export async function sendWelcomeEmail({
  to,
  password,
}: {
  to: string;
  password: string;
}) {
  const loginUrl = "https://luminqa.pro/login";

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8f9fb;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:#0f172a;border-radius:12px 12px 0 0;padding:32px 28px;text-align:center;">
      <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0;letter-spacing:-0.5px;">LuminQA</h1>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:6px 0 0;">Portal de Partners</p>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:32px 28px;border:1px solid #e2e5ea;border-top:none;">

      <h2 style="color:#0f172a;font-size:18px;font-weight:600;margin:0 0 16px;">Bienvenido al Portal de Partners</h2>

      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px;">
        Tu cuenta ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso.
      </p>

      <!-- Credentials Box -->
      <div style="background:#ecfeff;border:1px solid #0891b2;border-radius:8px;padding:20px;margin:0 0 24px;">
        <div style="font-size:12px;color:#0e7490;font-weight:600;margin-bottom:12px;">CREDENCIALES DE ACCESO</div>
        <table style="width:100%;font-size:14px;">
          <tr>
            <td style="color:#6b7280;padding:4px 0;width:80px;">Email:</td>
            <td style="color:#0f172a;font-weight:600;">${to}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;padding:4px 0;">Password:</td>
            <td style="color:#0f172a;font-weight:600;font-family:monospace;font-size:15px;">${password}</td>
          </tr>
        </table>
      </div>

      <!-- Steps -->
      <h3 style="color:#0f172a;font-size:15px;font-weight:600;margin:0 0 12px;">Instrucciones de ingreso:</h3>
      <ol style="color:#6b7280;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 24px;">
        <li>Ingresa a <a href="${loginUrl}" style="color:#0891b2;text-decoration:none;font-weight:500;">luminqa.pro</a></li>
        <li>Usa las credenciales proporcionadas arriba</li>
        <li><strong style="color:#0f172a;">Cambia tu contraseña</strong> en el primer inicio de sesión (obligatorio)</li>
        <li>Explora las herramientas de pricing, ROI y benchmark</li>
      </ol>

      <!-- CTA Button -->
      <div style="text-align:center;margin:0 0 24px;">
        <a href="${loginUrl}" style="display:inline-block;background:#0891b2;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Ingresar al Portal</a>
      </div>

      <!-- Security Notice -->
      <div style="background:#fef3c7;border-left:3px solid #f59e0b;border-radius:0 6px 6px 0;padding:14px 16px;margin:0 0 8px;">
        <div style="font-size:12px;font-weight:600;color:#92400e;margin-bottom:4px;">INFORMACIÓN CONFIDENCIAL</div>
        <p style="color:#92400e;font-size:13px;line-height:1.5;margin:0;">
          Este correo contiene credenciales de acceso a información comercial confidencial de LuminQA.
          No compartas estas credenciales. Cambia tu contraseña inmediatamente después del primer ingreso.
          Si no solicitaste esta cuenta, ignora este mensaje.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#0f172a;border-radius:0 0 12px 12px;padding:20px 28px;text-align:center;">
      <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;">
        LuminQA — Automatización de QA con Inteligencia Artificial<br>
        Este es un correo automático del sistema. No responder a este mensaje.
      </p>
    </div>

  </div>
</body>
</html>`;

  return getResend().emails.send({
    from: "LuminQA Partners <sales@luminqa.pro>",
    to: [to],
    subject: "Bienvenido al Portal de Partners — LuminQA",
    html,
  });
}
