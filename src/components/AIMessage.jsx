import { useState } from "react";
import { generateWeeklyMessage, modoDemo } from "../lib/claude";

export default function AIMessage({ checkins, grupoNombre }) {
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const generar = async () => {
    setLoading(true);
    try {
      const texto = await generateWeeklyMessage(checkins, grupoNombre);
      setMensaje(texto);
    } catch {
      setMensaje("Hubo un problema generando el mensaje. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-kallpa-coral/15 rounded-3xl shadow-card p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest text-kallpa-coral-dark/60 font-semibold">
          Mensaje de la semana
        </p>
        {modoDemo && (
          <span className="text-[10px] font-semibold bg-white/70 text-kallpa-coral-dark/60 px-2 py-0.5 rounded-full">
            modo demo
          </span>
        )}
      </div>

      {mensaje ? (
        <p className="font-display text-base text-kallpa-coral-dark leading-relaxed">{mensaje}</p>
      ) : (
        <button
          onClick={generar}
          disabled={loading}
          className="text-sm font-semibold text-kallpa-coral-dark underline decoration-kallpa-coral/50 underline-offset-4 disabled:opacity-50"
        >
          {loading ? "Generando..." : "Ver mensaje del grupo"}
        </button>
      )}
    </div>
  );
}
