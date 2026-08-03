import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Mascota from "../components/Mascota";
import { login } from "../lib/auth";
import { encontrarOCrearGrupo } from "../lib/matching";

const pasos = [
  "Revisando tu carga académica...",
  "Buscando estudiantes en tu misma situación...",
  "Armando tu mancha...",
];

export default function Matching() {
  const [pasoActual, setPasoActual] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const started = useRef(false);

  useEffect(() => {
    const datos = location.state;
    if (!datos) {
      navigate("/");
      return;
    }
    if (started.current) return;
    started.current = true;

    const stepInterval = setInterval(() => {
      setPasoActual((p) => Math.min(p + 1, pasos.length - 1));
    }, 700);

    (async () => {
      try {
        const profile = await login(datos);
        const groupId = await encontrarOCrearGrupo({
          userId: profile.id,
          carrera: datos.carrera,
          ciclo: datos.ciclo,
        });
        // Deja ver el último paso un momento antes de navegar
        setTimeout(() => {
          clearInterval(stepInterval);
          navigate("/app", { state: { groupId } });
        }, 1400);
      } catch (e) {
        clearInterval(stepInterval);
        setError(e.message || "No se pudo completar el matching.");
      }
    })();

    return () => clearInterval(stepInterval);
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mascota size={72} />
        </motion.div>

        <div className="mt-8 space-y-3 min-h-[90px]">
          {error ? (
            <p className="text-sm text-kallpa-coral-dark bg-white rounded-xl px-4 py-3">
              {error} — <button onClick={() => navigate("/")} className="underline">volver</button>
            </p>
          ) : (
            pasos.slice(0, pasoActual + 1).map((paso, i) => (
              <motion.p
                key={paso}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: i === pasoActual ? 1 : 0.35, y: 0 }}
                className="text-kallpa-coral-dark font-medium"
              >
                {paso}
              </motion.p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
