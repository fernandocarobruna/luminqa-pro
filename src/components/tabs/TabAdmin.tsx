"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned: boolean;
}

export default function TabAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.users) setUsers(data.users);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, password: newPassword }),
    });
    const data = await res.json();

    if (data.error) {
      setError(data.error);
    } else {
      setMessage(`Partner ${newEmail} creado exitosamente`);
      setNewEmail("");
      setNewPassword("");
      fetchUsers();
    }
    setCreating(false);
  }

  async function handleAction(userId: string, action: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    fetchUsers();
  }

  function formatDate(d: string | null) {
    if (!d) return "Nunca";
    return new Date(d).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <div className="section-title">Administrador de Partners</div>
      <div className="section-sub">
        Gestiona las cuentas de acceso al portal. Solo visible para
        administradores.
      </div>

      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>Crear nuevo partner</h3>
          <form onSubmit={handleCreate}>
            <div className="slider-row">
              <label style={{ minWidth: 80 }}>Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                placeholder="partner@empresa.com"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 13,
                }}
              />
            </div>
            <div className="slider-row">
              <label style={{ minWidth: 80 }}>Password</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Contraseña inicial"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 13,
                }}
              />
            </div>
            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  marginBottom: 10,
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
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={creating}
              style={{
                padding: "10px 20px",
                background: creating ? "var(--muted)" : "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: creating ? "not-allowed" : "pointer",
              }}
            >
              {creating ? "Creando..." : "Crear partner"}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Resumen</h3>
          <div className="grid g3">
            <div
              style={{
                background: "var(--accentLight)",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--navy)" }}>
                {users.length}
              </div>
              <div style={{ fontSize: 12, color: "var(--accent2)" }}>
                Total partners
              </div>
            </div>
            <div
              style={{
                background: "#d1fae5",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: "#065f46" }}>
                {users.filter((u) => !u.banned).length}
              </div>
              <div style={{ fontSize: 12, color: "#065f46" }}>Activos</div>
            </div>
            <div
              style={{
                background: "#fee2e2",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: "#991b1b" }}>
                {users.filter((u) => u.banned).length}
              </div>
              <div style={{ fontSize: 12, color: "#991b1b" }}>Suspendidos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Partners registrados</h3>
        {loading ? (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Creado</th>
                <th>Último login</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <b>{u.email}</b>
                  </td>
                  <td>{formatDate(u.created_at)}</td>
                  <td>{formatDate(u.last_sign_in_at)}</td>
                  <td>
                    {u.banned ? (
                      <span className="tag tag-red">Suspendido</span>
                    ) : (
                      <span className="tag tag-green">Activo</span>
                    )}
                  </td>
                  <td>
                    {u.banned ? (
                      <button
                        onClick={() => handleAction(u.id, "unban")}
                        style={{
                          padding: "4px 10px",
                          background: "var(--success)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          fontSize: 11,
                          cursor: "pointer",
                          marginRight: 6,
                        }}
                      >
                        Reactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(u.id, "ban")}
                        style={{
                          padding: "4px 10px",
                          background: "var(--warn)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          fontSize: 11,
                          cursor: "pointer",
                          marginRight: 6,
                        }}
                      >
                        Suspender
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar ${u.email}? Esta acción es irreversible.`)) {
                          handleAction(u.id, "delete");
                        }
                      }}
                      style={{
                        padding: "4px 10px",
                        background: "var(--danger)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
