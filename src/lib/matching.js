import { supabase, supabaseConfigured } from "./supabaseClient";

const MAX_INTEGRANTES = 5;
const NOMBRES_MANCHA = ["Tu mancha", "La mancha", "Full carga", "Aguante juntos"];

function nombreAleatorio() {
  return NOMBRES_MANCHA[Math.floor(Math.random() * NOMBRES_MANCHA.length)];
}

// Busca un grupo con la misma carrera y ciclo que tenga espacio.
// Si no encuentra ninguno, crea uno nuevo. Devuelve el group_id.
export async function encontrarOCrearGrupo({ userId, carrera, ciclo }) {
  if (!supabaseConfigured) return "demo-group";

  // 1. Busca grupos existentes de la misma carrera/ciclo
  const { data: gruposCandidatos } = await supabase
    .from("groups")
    .select("id, carrera, ciclo")
    .eq("carrera", carrera || null)
    .eq("ciclo", ciclo || null);

  for (const g of gruposCandidatos || []) {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("group_id", g.id);

    if ((count || 0) < MAX_INTEGRANTES) {
      await supabase.from("profiles").update({ group_id: g.id }).eq("id", userId);
      return g.id;
    }
  }

  // 2. No hay grupo con espacio: crea uno nuevo
  const { data: nuevoGrupo, error } = await supabase
    .from("groups")
    .insert({ name: nombreAleatorio(), carrera, ciclo })
    .select()
    .single();

  if (error) throw error;

  await supabase.from("profiles").update({ group_id: nuevoGrupo.id }).eq("id", userId);

  // Crea un micro-reto inicial para el grupo nuevo
  await supabase.from("challenges").insert({
    group_id: nuevoGrupo.id,
    titulo: "Esta semana el grupo intenta dormir 7 horas",
  });

  return nuevoGrupo.id;
}
