import { supabase, supabaseConfigured } from "./supabaseClient";

// Fallback a localStorage si Supabase no está configurado (modo demo offline)
const KEY = "kallpa_user";

function initials(name) {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function getSession() {
  if (!supabaseConfigured) {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return profile;
}

export async function login({ name, carrera, ciclo }) {
  if (!supabaseConfigured) {
    const user = { id: "demo-" + Date.now(), name, initials: initials(name), carrera, ciclo };
    localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  }

  // 1. Sesión anónima real de Supabase (no requiere contraseña)
  const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
  if (authError) throw authError;

  const userId = authData.user.id;

  // 2. Crea el perfil vinculado a esa sesión
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      name,
      initials: initials(name),
      carrera: carrera || null,
      ciclo: ciclo || null,
    })
    .select()
    .single();

  if (profileError) throw profileError;
  return profile;
}

export async function logout() {
  if (!supabaseConfigured) {
    localStorage.removeItem(KEY);
    return;
  }
  await supabase.auth.signOut();
}
