import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Insert notification for admin
  const adminClient = createAdminClient();
  await adminClient.from("admin_notifications").insert({
    type: "account_activated",
    user_email: user.email,
    message: `Partner ${user.email} activó su cuenta`,
    read: false,
  });

  return NextResponse.json({ success: true });
}
