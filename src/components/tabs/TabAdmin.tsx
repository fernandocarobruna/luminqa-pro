"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface Notification {
  id: string;
  type: string;
  user_email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function TabAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [useGenerator, setUseGenerator] = useState(true);

  function generatePassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let pass = "";
    for (let i = 0; i < 14; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    return pass;
  }

  function handleGenerate() {
    setNewPassword(generatePassword());
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.users) setUsers(data.users);
    setLoading(false);
  }, []);

  const fetchNotifications = useCallback(async () => {
    const res = await fetch("/api/admin/notifications");
    const data = await res.json();
    if (data.notifications) setNotifications(data.notifications);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, [fetchUsers, fetchNotifications]);

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
    if (data.error) { setError(data.error); }
    else {
      setMessage("Partner " + newEmail + " creado. Se envió un email con las credenciales e instrucciones.");
      setNewEmail(""); setNewPassword(""); fetchUsers();
    }
    setCreating(false);
  }

  async function handleAction(userId: string, action: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    fetchUsers(); fetchNotifications();
  }

  async function markAllRead() {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "all" }),
    });
    fetchNotifications();
  }

  function formatDate(d: string | null) {
    if (!d) return "\u2014";
    return new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const statusTag = (s: string) => {
    if (s === "activo") return <span className="tag tag-green">Activo</span>;
    if (s === "creado") return <span className="tag tag-amber">Creado</span>;
    return <span className="tag tag-red">Eliminado</span>;
  };

  const roleTag = (r: string) => {
    if (r === "admin") return <span className="tag tag-purple">Admin</span>;
    return <span className="tag tag-blue">Partner</span>;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="section-title">Administrador de Partners</div>
      <div className="section-sub">Gestiona las cuentas de acceso al portal. Solo visible para administradores.</div>

      {unreadCount > 0 && (
        <div className="card" style={{ marginBottom: 16, borderLeft: "3px solid var(--accent)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>Notificaciones <span style={{ background: "var(--danger)", color: "#fff", borderRadius: 10, padding: "2px 8px", fontSize: 11, marginLeft: 8 }}>{unreadCount}</span></h3>
            <button onClick={markAllRead} style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Marcar todas como leídas</button>
          </div>
          {notifications.filter((n) => !n.read).slice(0, 5).map((n) => (
            <div key={n.id} style={{ padding: "8px 12px", background: "var(--accentLight)", borderRadius: 6, fontSize: 13, marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
              <span>{n.message}</span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>{formatDate(n.created_at)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>Crear nuevo partner</h3>
          <form onSubmit={handleCreate}>
            <div className="slider-row">
              <label style={{ minWidth: 80 }}>Email</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required placeholder="partner@empresa.com" style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13 }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button type="button" onClick={() => { setUseGenerator(true); handleGenerate(); }} style={{ padding: "6px 12px", background: useGenerator ? "var(--accent)" : "var(--bg)", color: useGenerator ? "#fff" : "var(--muted)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Generar segura</button>
                <button type="button" onClick={() => { setUseGenerator(false); setNewPassword(""); }} style={{ padding: "6px 12px", background: !useGenerator ? "var(--accent)" : "var(--bg)", color: !useGenerator ? "#fff" : "var(--muted)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Manual</button>
              </div>
              <div className="slider-row">
                <label style={{ minWidth: 80 }}>Password</label>
                {useGenerator ? (
                  <div style={{ flex: 1, display: "flex", gap: 6 }}>
                    <input type="text" value={newPassword} readOnly style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, fontFamily: "monospace", background: "var(--accentLight)" }} />
                    <button type="button" onClick={handleGenerate} style={{ padding: "8px 12px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>Otra</button>
                  </div>
                ) : (
                  <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} placeholder="Mínimo 8 caracteres" style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13 }} />
                )}
              </div>
            </div>
            {error && (<div style={{ background: "#fee2e2", color: "#991b1b", padding: "8px 12px", borderRadius: 6, fontSize: 12, marginBottom: 10 }}>{error}</div>)}
            {message && (<div style={{ background: "#d1fae5", color: "#065f46", padding: "8px 12px", borderRadius: 6, fontSize: 12, marginBottom: 10 }}>{message}</div>)}
            <button type="submit" disabled={creating} style={{ padding: "10px 20px", background: creating ? "var(--muted)" : "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: creating ? "not-allowed" : "pointer" }}>{creating ? "Creando..." : "Crear partner"}</button>
          </form>
          <div className="note" style={{ marginTop: 12 }}>El partner deberá cambiar su contraseña en el primer inicio de sesión.</div>
        </div>

        <div className="card">
          <h3>Resumen</h3>
          <div className="grid g3">
            <div style={{ background: "var(--accentLight)", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--navy)" }}>{users.length}</div>
              <div style={{ fontSize: 12, color: "var(--accent2)" }}>Total</div>
            </div>
            <div style={{ background: "#d1fae5", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#065f46" }}>{users.filter((u) => u.status === "activo").length}</div>
              <div style={{ fontSize: 12, color: "#065f46" }}>Activos</div>
            </div>
            <div style={{ background: "#fef3c7", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#92400e" }}>{users.filter((u) => u.status === "creado").length}</div>
              <div style={{ fontSize: 12, color: "#92400e" }}>Pendientes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Partners registrados</h3>
        {loading ? (<p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando...</p>) : (
          <table>
            <thead><tr><th>Email</th><th>Tipo</th><th>Estado</th><th>Creado</th><th>Último login</th><th>Acciones</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><b>{u.email}</b></td>
                  <td>{roleTag(u.role)}</td>
                  <td>{statusTag(u.status)}</td>
                  <td>{formatDate(u.created_at)}</td>
                  <td>{formatDate(u.last_sign_in_at)}</td>
                  <td>
                    {u.role !== "admin" && (<>
                      {u.status === "eliminado" ? (
                        <button onClick={() => handleAction(u.id, "reactivate")} style={{ padding: "4px 10px", background: "var(--success)", color: "#fff", border: "none", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Reactivar</button>
                      ) : (
                        <button onClick={() => { if (confirm("¿Eliminar cuenta de " + u.email + "?")) handleAction(u.id, "delete"); }} style={{ padding: "4px 10px", background: "var(--danger)", color: "#fff", border: "none", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Eliminar</button>
                      )}
                    </>)}
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
