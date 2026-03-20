import { createAdminClient, isAdminEmail } from "@/lib/supabase-admin";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("admin_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ notifications: data ?? [] });
}

export async function PATCH(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await request.json();
  const supabaseAdmin = createAdminClient();

  if (id === "all") {
    await supabaseAdmin.from("admin_notifications").update({ read: true }).eq("read", false);
  } else {
    await supabaseAdmin.from("admin_notifications").update({ read: true }).eq("id", id);
  }

  return NextResponse.json({ success: true });
}
