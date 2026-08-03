
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
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
