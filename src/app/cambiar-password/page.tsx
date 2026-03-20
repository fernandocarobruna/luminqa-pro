"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CambiarPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
      data: { must_change_password: false },
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Notify admin that partner activated account
    await fetch("/api/auth/change-password", { method: "POST" });

    router.push("/");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div
          style={{
            background: "var(--navy)",
            color: "#fff",
            padding: "32px 28px 24px",
            borderRadius: "12px 12px 0 0",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>LuminQA</h1>
          <p style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
            Cambiar contraseña
          </p>
        </div>

        <div
          className="card"
          style={{
            borderRadius: "0 0 12px 12px",
            borderTop: "none",
            padding: 28,
          }}
        >
          <div className="note" style={{ marginTop: 0, marginBottom: 20 }}>
            Por seguridad, debes establecer una nueva contraseña para continuar.
            Mínimo 8 caracteres.
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                  color: "var(--navy)",
                }}
              >
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                  color: "var(--navy)",
                }}
              >
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                placeholder="Repetir contraseña"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 20px",
                background: loading ? "var(--muted)" : "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
