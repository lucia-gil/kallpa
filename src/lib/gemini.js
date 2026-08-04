
const keysString = import.meta.env.VITE_GEMINI_API_KEYS || "";
const KEYS = keysString.split(",").map((k) => k.trim()).filter(Boolean);

export const geminiConfigurado = KEYS.length > 0;

function keyAleatoria() {
  return KEYS[Math.floor(Math.random() * KEYS.length)];
}

export async function generarMensajeChat(prompt, fallback) {
  if (!geminiConfigurado) return fallback;
  try {
    const key = keyAleatoria();
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    if (!response.ok) throw new Error("Gemini request failed");
    const data = await response.json();
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return texto?.trim() || fallback;
  } catch {
    return fallback;
  }
}

const PALABRAS_RIESGO = [
  "suicid", "matarme", "no quiero vivir", "hacerme daño",
  "cortarme", "no vale la pena vivir", "quiero desaparecer",
];

export function detectarRiesgo(mensaje) {
  const texto = mensaje.toLowerCase();
  return PALABRAS_RIESGO.some((p) => texto.includes(p));
}

export const MENSAJE_CRISIS = `Lo que me cuentas es muy importante y no estás solo/a en esto.
Por favor, habla ahora mismo con alguien que pueda ayudarte de verdad:

📞 Línea 113 opción 5 (Salud Mental - MINSA, Perú) - gratuita, 24/7
📞 O contacta a un adulto de confianza ahora mismo

Tu vida importa. Esto que sientes ahora puede pasar.`;

const SYSTEM_PROMPT_APOYO = `Eres Kallpa, un acompañante emocional para jóvenes que atraviesan burnout académico o laboral.

NO diagnosticas condiciones de salud mental.
NO das consejos médicos ni farmacológicos.
NO minimizas lo que la persona siente.
NO usas frases hechas o clichés vacíos como "todo va a estar bien".

Tu forma de responder:
1. Valida lo que la persona expresa, con lenguaje natural, cálido y cercano (no clínico).
2. Haz una pregunta abierta para que se sienta escuchada, si es apropiado.
3. Solo si tiene sentido, sugiere algo concreto y simple (una pausa, respiración, reencuadre) - nunca lo impongas.

Responde en español, de forma breve (máximo 3-4 líneas), como lo haría un amigo empático y presente.`;

export async function generarRespuestaApoyo(historial) {
  const ultimoMensaje = historial[historial.length - 1]?.texto || "";

  if (detectarRiesgo(ultimoMensaje)) {
    return { texto: MENSAJE_CRISIS, tipo: "crisis" };
  }

  if (!geminiConfigurado) {
    return {
      texto: "Modo demo: no tengo una IA conectada ahora mismo, pero cuéntame igual cómo te sientes.",
      tipo: "demo",
    };
  }

  try {
    const key = keyAleatoria();
    const contents = historial.map((m) => ({
      role: m.rol === "usuario" ? "user" : "model",
      parts: [{ text: m.texto }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT_APOYO }] },
          generationConfig: { maxOutputTokens: 300 },
        }),
      }
    );
    if (!response.ok) {
      const detalle = await response.text();
      throw new Error(`Gemini request failed (${response.status}): ${detalle}`);
    }
    const data = await response.json();
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return { texto: texto?.trim() || "No pude generar una respuesta, ¿lo intentamos de nuevo?", tipo: "normal" };
  } catch (error) {
    console.error("[Kallpa] Error en generarRespuestaApoyo:", error);
    return { texto: "Ups, no pude conectarme. Intenta de nuevo en un momento 🙏", tipo: "error" };
  }
}
