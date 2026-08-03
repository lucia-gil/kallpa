import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const VIDEO_ID = "Pd3TcScm6UU";
const DURACION = 180; // 3 minutos

export default function Meditar() {
  const [estado, setEstado] = useState("idle"); // idle | activo | listo
  const [segundos, setSegundos] = useState(DURACION);

  useEffect(() => {
    if (estado !== "activo") return;
    if (segundos === 0) {
      setEstado("listo");
      return;
    }
    const id = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [estado, segundos]);

  const iniciar = () => {
    setSegundos(DURACION);
    setEstado("activo");
  };

  const cerrar = () => {
    setEstado("idle");
    setSegundos(DURACION);
  };

  const minutos = Math.floor(segundos / 60);
  const segs = String(segundos % 60).padStart(2, "0");

  const modal = estado !== "idle" && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-kallpa-coral-dark/40 backdrop-blur-sm p-6">
      <div className="bg-kallpa-cream rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
        {estado === "activo" ? (
          <>
            <p className="text-xs uppercase tracking-wide text-kallpa-teal-dark/60 mb-2">
              Respira
            </p>
            <p className="font-title text-5xl font-semibold text-kallpa-teal-dark mb-4 tabular-nums">
              {minutos}:{segs}
            </p>
            <p className="text-sm text-kallpa-text/70 mb-4">
              Cierra los ojos, respira profundo y deja que pase el tiempo.
            </p>
            <iframe
              className="sr-only"
              width="1"
              height="1"
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`}
              title="Música de meditación"
              allow="autoplay; encrypted-media"
              frameBorder="0"
            />
            <button
              onClick={cerrar}
              className="text-sm font-medium text-kallpa-coral-dark underline"
            >
              Terminar antes
            </button>
          </>
        ) : (
          <>
            <p className="text-3xl mb-3">🌿</p>
            <p className="font-title text-xl font-semibold text-kallpa-teal-dark mb-2">
              Sesión completada
            </p>
            <p className="text-sm text-kallpa-text/70 mb-5">
              Buen trabajo. Llévate esa calma contigo.
            </p>
            <button
              onClick={cerrar}
              className="text-sm font-medium bg-kallpa-teal text-white rounded-full px-4 py-2 hover:opacity-90 transition"
            >
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-kallpa-teal/20 rounded-3xl p-5">
      <p className="text-xs uppercase tracking-wide text-kallpa-teal-dark/60 mb-2">
        Un momento para ti
      </p>
      <p className="text-sm text-kallpa-teal-dark mb-3">
        3 minutos de pausa, respirando con música suave.
      </p>
      <button
        onClick={iniciar}
        className="text-sm font-medium bg-kallpa-teal text-white rounded-full px-4 py-2 hover:opacity-90 transition"
      >
        Meditar
      </button>
      {modal && createPortal(modal, document.body)}
    </div>
  );
}
