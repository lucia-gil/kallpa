import { supabase, supabaseConfigured } from "./supabaseClient";

const MAX_INTEGRANTES = 5;
const NOMBRES_MANCHA = ["Tu mancha", "La mancha", "Full carga", "Aguante juntos"];

function nombreAleatorio() {
  return NOMBRES_MANCHA[Math.floor(Math.random() * NOMBRES_MANCHA.length)];
}

async function grupoConEspacio(query) {
  const { data: candidatos } = await query;
  for (const g of candidatos || []) {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("group_id", g.id);
    if ((count || 0) < MAX_INTEGRANTES) return g;
  }
  return null;
}

export async function encontrarOCrearGrupo({ userId, carrera, ciclo, tipo_apoyo }) {
  if (!supabaseConfigured) return "demo-group";

  let grupo = await grupoConEspacio(
    supabase
      .from("groups")
      .select("id, carrera, ciclo, tipo_apoyo")
      .eq("carrera", carrera || null)
      .eq("ciclo", ciclo || null)
      .eq("tipo_apoyo", tipo_apoyo || null)
  );

  if (!grupo) {
    grupo = await grupoConEspacio(
      supabase
        .from("groups")
        .select("id, carrera, ciclo, tipo_apoyo")
        .eq("carrera", carrera || null)
        .eq("ciclo", ciclo || null)
    );
  }

  if (grupo) {
    await supabase.from("profiles").update({ group_id: grupo.id }).eq("id", userId);
    return grupo.id;
  }

  const { data: nuevoGrupo, error } = await supabase
    .from("groups")
    .insert({ name: nombreAleatorio(), carrera, ciclo, tipo_apoyo })
    .select()
    .single();

  if (error) throw error;

  await supabase.from("profiles").update({ group_id: nuevoGrupo.id }).eq("id", userId);

  await supabase.from("challenges").insert({
    group_id: nuevoGrupo.id,
    titulo: "Esta semana el grupo intenta dormir 7 horas",
  });

  return nuevoGrupo.id;
}