import { createAdminClient, isAdminEmail } from "@/lib/supabase-admin";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

function getUserStatus(user: { last_sign_in_at: string | null; banned_until: string | null; user_metadata?: { must_change_password?: boolean } }): string {
  if (user.banned_until) return "eliminado";
  if (!user.last_sign_in_at || user.user_metadata?.must_change_password) return "creado";
  return "activo";
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.user_metadata?.role ?? (isAdminEmail(u.email) ? "admin" : "partner"),
    status: getUserStatus({
      last_sign_in_at: u.last_sign_in_at ?? null,
      banned_until: u.banned_until ?? null,
      user_metadata: u.user_metadata,
    }),
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
  }));

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email y password son requeridos" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password debe tener mínimo 8 caracteres" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "partner",
      must_change_password: true,
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Send welcome email with credentials
  try {
    await sendWelcomeEmail({ to: email, password });
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
    // Don't fail the user creation if email fails
  }

  return NextResponse.json({
    user: { id: data.user.id, email: data.user.email, created_at: data.user.created_at },
    emailSent: true,
  });
}

export async function PATCH(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { userId, action } = await request.json();
  if (!userId || !action) {
    return NextResponse.json({ error: "userId y action son requeridos" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  if (action === "delete") {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: "876600h",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userData?.user) {
      await supabaseAdmin.from("admin_notifications").insert({
        type: "account_deleted",
        user_email: userData.user.email,
        message: "Cuenta de " + userData.user.email + " fue eliminada por admin",
        read: false,
      });
    }
  } else if (action === "reactivate") {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: "none",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userData?.user) {
      await supabaseAdmin.from("admin_notifications").insert({
        type: "account_reactivated",
        user_email: userData.user.email,
        message: "Cuenta de " + userData.user.email + " fue reactivada",
        read: false,
      });
    }
  }

  return NextResponse.json({ success: true });
}
