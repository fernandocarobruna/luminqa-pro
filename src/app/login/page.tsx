"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "password") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Revisa tu email — te enviamos un link de acceso.");
      }
    }

    setLoading(false);
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
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
            LuminQA
          </h1>
          <p style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
            Portal de Partners
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
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 24,
              background: "var(--bg)",
              borderRadius: 8,
              padding: 4,
            }}
          >
            <button
              className={`tab ${mode === "password" ? "active" : ""}`}
              onClick={() => setMode("password")}
              style={{ flex: 1, textAlign: "center" }}
            >
              Email + Password
            </button>
            <button
              className={`tab ${mode === "magic" ? "active" : ""}`}
              onClick={() => setMode("magic")}
              style={{ flex: 1, textAlign: "center" }}
            >
              Magic Link
            </button>
          </div>

          <form onSubmit={handleLogin}>
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
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="partner@empresa.com"
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

            {mode === "password" && (
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
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Tu contraseña"
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
            )}

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

            {message && (
              <div
                style={{
                  background: "#d1fae5",
                  color: "#065f46",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                {message}
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
                transition: "background .2s",
              }}
            >
              {loading
                ? "Procesando..."
                : mode === "password"
                ? "Iniciar sesión"
                : "Enviar magic link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
