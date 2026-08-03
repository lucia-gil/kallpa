import { useState } from "react";
import { generateWeeklyMessage } from "../lib/claude";

export default function AIMessage({ checkins, grupoNombre }) {
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const generar = async () => {
    setLoading(true);
    try {
      const texto = await generateWeeklyMessage(checkins, grupoNombre);
      setMensaje(texto);
    } catch (e) {
      setMensaje("Hubo un problema generando el mensaje. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-kallpa-coral/15 rounded-3xl p-5">
      <p className="text-xs uppercase tracking-wide text-kallpa-coral-dark/60 mb-2">
        Mensaje de la semana
      </p>
      {mensaje ? (
        <p className="text-sm text-kallpa-coral-dark leading-relaxed">{mensaje}</p>
      ) : (
        <button
          onClick={generar}
          disabled={loading}
          className="text-sm font-medium text-kallpa-coral-dark underline disabled:opacity-50"
        >
          {loading ? "Generando..." : "Ver mensaje del grupo"}
        </button>
      )}
    </div>
  );
}
