
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Si no hay key configurada, la app funciona en "modo demo": usa mensajes
// precargados en vez de llamar a la API. Así el proyecto se puede correr,
// mostrar, y presentar sin necesitar una cuenta de pago en Console.
export const modoDemo = !API_KEY;

export async function generateWeeklyMessage(checkins, grupoNombre) {
  if (modoDemo) {
    const { getMensajeDemo } = await import("../data/mensajesDemo");
    // Simula un pequeño delay como si fuera una llamada real
    await new Promise((r) => setTimeout(r, 600));
    return getMensajeDemo(checkins.length);
  }

  const resumen = checkins
    .map((c) => `- ${c.mood}: ${c.nota}`)
    .join("\n");

  const prompt = `Eres un mensaje cálido y breve (máximo 3 frases) para un grupo
de apoyo entre universitarios llamado "${grupoNombre}" en una app llamada Kallpa.
Con base en estos check-ins de la semana, escribe un mensaje empático que valide
cómo se sienten, sin sonar clínico ni corporativo, en tono cercano y peruano.
No des consejos médicos. Termina sugiriendo un micro-reto simple de descanso
(dormir mejor, desconectar un rato, etc).

Check-ins de la semana:
${resumen}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.find((b) => b.type === "text")?.text;
  return text || "No se pudo generar el mensaje esta semana.";
}
