"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "rgba(255,255,255,0.15)",
        color: "#fff",
        border: "none",
        padding: "5px 14px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        transition: "background .2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
      }
    >
      Cerrar sesión
    </button>
  );
}
