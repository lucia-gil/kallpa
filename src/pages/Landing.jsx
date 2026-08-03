import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Mascota from "../components/Mascota";
import { getSession } from "../lib/auth";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const PREGUNTA_ANIMO = {
  key: "estado_animo",
  texto: '¿Cómo te sientes con la "U" ahora mismo?',
  opciones: [
    { valor: "agotamiento", label: "Agotadaza, siento que mi batería está en 0%" },
    { valor: "cinismo", label: "Un poco desmotivada, como que ya me da igual todo" },
    { valor: "ineficacia", label: "Siento que no avanzo o que no doy la talla" },
    { valor: "leve", label: "Ahí vamos, solo necesito un respiro para no explotar" },
  ],
};

const PREGUNTA_APOYO = {
  key: "tipo_apoyo",
  texto: "Si la cosa se pone pesada, ¿qué es lo que más te ayuda de un grupo?",
  opciones: [
    { valor: "catarsis", label: "Que me escuchen y poder soltar todo" },
    { valor: "practico", label: "Tips o consejos prácticos para organizarme mejor" },
    { valor: "pertenencia", label: "Saber que otros están en las mismas que yo" },
    { valor: "desconexion", label: "Desconectar un rato y hablar de otra cosa" },
  ],
};

const PREGUNTA_RETO = {
  key: "reto_principal",
  texto: "¿Cuál es tu mayor reto para equilibrar tu vida hoy?",
  opciones: [
    { valor: "cursos", label: "Tengo demasiados cursos y tareas pendientes" },
    { valor: "trabajo", label: "Tengo que trabajar y estudiar al mismo tiempo" },
    { valor: "vinculos", label: "No tengo tiempo para mi familia o amigos" },
    { valor: "pantallas", label: "Me cuesta mucho desconectarme de las pantallas" },
  ],
};

const PREGUNTAS = [PREGUNTA_ANIMO, PREGUNTA_APOYO, PREGUNTA_RETO];

export default function Landing() {
  const [paso, setPaso] = useState(0); // 0 = datos básicos, 1..3 = preguntas
  const [name, setName] = useState("");
  const [carrera, setCarrera] = useState("");
  const [ciclo, setCiclo] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  // Si ya hay sesión activa (mismo navegador), no pedimos el formulario de nuevo
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.group_id) {
        navigate("/app");
        return;
      }
      setCheckingSession(false);
    })();
  }, [navigate]);

  const handleDatosBasicos = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setPaso(1);
  };

  const handleRespuesta = (key, valor) => {
    const nuevas = { ...respuestas, [key]: valor };
    setRespuestas(nuevas);
    if (paso < PREGUNTAS.length) {
      setPaso(paso + 1);
    } else {
      navigate("/matching", { state: { name, carrera, ciclo, ...nuevas } });
    }
  };

  if (checkingSession) return null;

  const preguntaActual = paso >= 1 && paso <= PREGUNTAS.length ? PREGUNTAS[paso - 1] : null;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <Mascota size={36} />
          <span className="font-title text-lg font-semibold text-kallpa-coral-dark">
            Kallpa
          </span>
        </div>

        <a
          href="#login"
          className="text-sm text-kallpa-coral-dark/70 hover:text-kallpa-coral-dark transition"
        >
          Iniciar sesión
        </a>
      </motion.nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-8 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.h1
            variants={fadeUp}
            className="font-title text-4xl md:text-5xl font-semibold text-kallpa-coral-dark leading-tight mb-4"
          >
            Nadie carga solo su ciclo.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-kallpa-text/80 leading-relaxed mb-6 max-w-md"
          >
            Kallpa te conecta con un pequeño grupo de estudiantes que están
            pasando por la misma sobrecarga que tú. Check-ins rápidos,
            apoyo real, y micro-retos de descanso entre pares.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 text-sm text-kallpa-coral-dark/70">
            <span className="bg-white/60 rounded-full px-4 py-1.5">Grupos de 3 a 5 personas</span>
            <span className="bg-white/60 rounded-full px-4 py-1.5">Sin presión, sin evaluación</span>
            <span className="bg-white/60 rounded-full px-4 py-1.5">Apoyo generado con IA</span>
          </motion.div>
        </motion.div>

        <motion.div
          id="login"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          className="bg-white rounded-3xl border border-kallpa-coral/15 p-8 shadow-lg shadow-kallpa-coral/10 min-h-[420px] flex flex-col"
        >
          <AnimatePresence mode="wait">
            {paso === 0 && (
              <motion.form
                key="datos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleDatosBasicos}
              >
                <h2 className="font-title text-xl font-semibold text-kallpa-coral-dark mb-1">
                  Entra a tu mancha
                </h2>
                <p className="text-sm text-kallpa-text/60 mb-6">
                  Demo — no necesitas contraseña, solo cuéntanos quién eres.
                </p>

                <label className="block text-sm text-kallpa-coral-dark/70 mb-1">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-kallpa-coral/20 px-3 py-2.5 text-sm mb-4 outline-none focus:ring-2 focus:ring-kallpa-teal"
                  required
                />

                <label className="block text-sm text-kallpa-coral-dark/70 mb-1">Carrera</label>
                <input
                  type="text"
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  placeholder="Ej: Ingeniería, Medicina..."
                  className="w-full rounded-xl border border-kallpa-coral/20 px-3 py-2.5 text-sm mb-4 outline-none focus:ring-2 focus:ring-kallpa-teal"
                />

                <label className="block text-sm text-kallpa-coral-dark/70 mb-1">Ciclo actual</label>
                <input
                  type="text"
                  value={ciclo}
                  onChange={(e) => setCiclo(e.target.value)}
                  placeholder="Ej: 6"
                  className="w-full rounded-xl border border-kallpa-coral/20 px-3 py-2.5 text-sm mb-6 outline-none focus:ring-2 focus:ring-kallpa-teal"
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full rounded-xl bg-kallpa-coral text-white py-3 font-medium hover:opacity-90 transition"
                >
                  Continuar
                </motion.button>
              </motion.form>
            )}

            {preguntaActual && (
              <motion.div
                key={preguntaActual.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-1"
              >
                <p className="text-xs text-kallpa-coral-dark/50 mb-2">
                  Pregunta {paso} de {PREGUNTAS.length}
                </p>
                <h2 className="font-title text-xl font-semibold text-kallpa-coral-dark mb-6">
                  {preguntaActual.texto}
                </h2>
                <div className="space-y-3 flex-1">
                  {preguntaActual.opciones.map((op) => (
                    <motion.button
                      key={op.valor}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRespuesta(preguntaActual.key, op.valor)}
                      className="w-full text-left rounded-xl border border-kallpa-coral/20 px-4 py-3 text-sm text-kallpa-coral-dark hover:bg-kallpa-coral/10 transition"
                    >
                      {op.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Cómo funciona */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="max-w-6xl mx-auto px-6 md:px-12 py-20"
      >
        <motion.p variants={fadeUp} className="text-sm uppercase tracking-wide text-kallpa-coral-dark/50 mb-2">
          Cómo funciona
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-title text-3xl font-semibold text-kallpa-coral-dark mb-12">
          Cuatro pasos, sin complicarte
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { n: "01", t: "Matching por afinidad", d: "Te agrupamos con estudiantes en tu misma situación y forma de buscar apoyo." },
            { n: "02", t: "Check-in rápido", d: "Comparte cómo va tu semana con un emoji y una nota corta." },
            { n: "03", t: "Mensaje del grupo", d: "Recibe un mensaje empático generado con IA según el ánimo del grupo." },
            { n: "04", t: "Micro-reto colectivo", d: "Cumplan juntos una meta simple de descanso, no de productividad." },
          ].map((step) => (
            <motion.div
              key={step.n}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-6 border border-kallpa-coral/10"
            >
              <span className="font-title text-3xl text-kallpa-coral/40">{step.n}</span>
              <h3 className="font-medium text-kallpa-coral-dark mt-3 mb-2">{step.t}</h3>
              <p className="text-sm text-kallpa-text/70 leading-relaxed">{step.d}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Estadísticas del problema */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="bg-kallpa-coral-dark px-6 md:px-12 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-title text-3xl font-semibold text-kallpa-cream mb-12 max-w-xl">
            El burnout universitario en Perú no es un caso aislado
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: "31.4%", d: "de universitarios en Lima padece burnout académico severo" },
              { stat: "67.7%", d: "de burnout moderado en universidades del sur del país" },
              { stat: "21.2%", d: "es la proporción de estudiantes que accede a servicios de bienestar" },
            ].map((s) => (
              <motion.div key={s.stat} variants={fadeUp}>
                <p className="font-title text-5xl font-semibold text-kallpa-coral mb-2">{s.stat}</p>
                <p className="text-kallpa-cream/80 text-sm leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA final */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="max-w-3xl mx-auto px-6 py-24 text-center"
      >
        <Mascota size={64} />
        <h2 className="font-title text-3xl font-semibold text-kallpa-coral-dark mt-4 mb-3">
          Tu pausa entre ciclos empieza hoy
        </h2>
        <p className="text-kallpa-text/70 mb-8">
          Únete a tu mancha y deja de cargar solo la sobrecarga.
        </p>
        <motion.a
          href="#login"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block bg-kallpa-coral text-white rounded-xl px-8 py-3 font-medium"
        >
          Entrar a Kallpa
        </motion.a>
      </motion.section>

      <footer className="text-center py-8 text-xs text-kallpa-text/40">
        Kallpa — Hackathon Global para Niñas en STEM, 2026
      </footer>
    </div>
  );
}