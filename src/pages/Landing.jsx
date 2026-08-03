import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Mascota from "../components/Mascota";
import ChatBubble from "../components/ChatBubble";
import CarreraInput from "../components/CarreraInput";
import { getSession } from "../lib/auth";
import { generarMensajeChat } from "../lib/gemini";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

function textoAnimo(genero) {
  const sufijo = genero === "hombre" ? "o" : genero === "mujer" ? "a" : "o/a";
  const agotamiento =
    genero === "hombre" ? "Agotado, siento que mi batería está en 0%"
    : genero === "mujer" ? "Agotada, siento que mi batería está en 0%"
    : "Agotade, siento que mi batería está en 0%";
  return [
    { valor: "agotamiento", label: agotamiento },
    { valor: "cinismo", label: `Un poco desmotivad${sufijo}, como que ya me da igual todo` },
    { valor: "ineficacia", label: "Siento que no avanzo o que no doy la talla" },
    { valor: "leve", label: "Ahí vamos, solo necesito un respiro para no explotar" },
  ];
}

const OPCIONES_GENERO = [
  { valor: "mujer", label: "Mujer" },
  { valor: "hombre", label: "Hombre" },
  { valor: "otro", label: "Otro / prefiero no decir" },
];
const OPCIONES_APOYO = [
  { valor: "catarsis", label: "Que me escuchen y poder soltar todo" },
  { valor: "practico", label: "Tips o consejos prácticos" },
  { valor: "pertenencia", label: "Saber que otros están en las mismas" },
  { valor: "desconexion", label: "Desconectar y hablar de otra cosa" },
];
const OPCIONES_RETO = [
  { valor: "cursos", label: "Demasiados cursos y tareas" },
  { valor: "trabajo", label: "Trabajar y estudiar a la vez" },
  { valor: "vinculos", label: "No tengo tiempo para mi gente" },
  { valor: "pantallas", label: "Me cuesta desconectar de pantallas" },
];

function reaccion(key, valor) {
  if (key === "estado_animo") {
    if (valor === "agotamiento") return "Uf, se nota que necesitas un respiro de verdad.";
    if (valor === "cinismo") return "Te entiendo, a veces cuesta encontrarle sentido a todo.";
    if (valor === "ineficacia") return "Sentir eso no te hace menos capaz, en serio.";
    return "Bien, un respiro nos cae bien a todos.";
  }
  if (key === "tipo_apoyo") return "Perfecto, con eso ya sé qué tipo de mancha buscarte.";
  if (key === "reto_principal") return "Gracias por contarme. Vamos a armar tu mancha con esto.";
  if (key === "genero") return "Gracias por confiarme eso.";
  if (key === "carrera") return "Genial.";
  if (key === "ciclo") return "Ok, ya casi terminamos.";
  return "";
}

export default function Landing() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [mensajes, setMensajes] = useState([]);
  const [pasoIdx, setPasoIdx] = useState(0);
  const [inputTexto, setInputTexto] = useState("");
  const [respuestas, setRespuestas] = useState({ name: "", carrera: "", ciclo: "" });
  const [saludoListo, setSaludoListo] = useState(false);
  const [escribiendo, setEscribiendo] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.group_id) {
        navigate("/app");
        return;
      }
      setCheckingSession(false);
      const saludo = await generarMensajeChat(
        "Genera un saludo breve (máximo 18 palabras) y cálido para invitar a un estudiante universitario peruano a escribir su nombre, en una app llamada Kallpa que ayuda contra el burnout. Tono cercano, sin exclamaciones excesivas.",
        "Antes de empezar, cuéntame tu nombre 🙂"
      );
      setMensajes([{ from: "bot", text: saludo }]);
      setSaludoListo(true);
      setEscribiendo(false);
    })();
  }, [navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes]);

  const STEPS = [
    { key: "name", type: "text", placeholder: "Tu nombre" },
    { key: "carrera", type: "carrera", prompt: () => `Un gusto, ${respuestas.name}. ¿Qué carrera estudias?` },
    { key: "ciclo", type: "text", numeric: true, prompt: () => "¿En qué ciclo vas?", placeholder: "Ej: 6" },
    { key: "genero", type: "choice", prompt: () => "¿Cómo te identificas? (para hablarte mejor)", opciones: OPCIONES_GENERO },
    { key: "estado_animo", type: "choice", prompt: () => '¿Cómo te sientes con la "U" ahora mismo?', opciones: textoAnimo(respuestas.genero) },
    { key: "tipo_apoyo", type: "choice", prompt: () => "Si la cosa se pone pesada, ¿qué te ayuda más de un grupo?", opciones: OPCIONES_APOYO },
    { key: "reto_principal", type: "choice", prompt: () => "¿Cuál es tu mayor reto para equilibrar tu vida hoy?", opciones: OPCIONES_RETO },
  ];

  const stepActual = STEPS[pasoIdx];

  const avanzar = (valor, labelMostrado) => {
    const nuevasRespuestas = { ...respuestas, [stepActual.key]: valor };
    setRespuestas(nuevasRespuestas);
    setInputTexto("");

    const userMsg = { from: "user", text: labelMostrado };
    const reaccionTexto = reaccion(stepActual.key, valor);
    const siguienteIdx = pasoIdx + 1;

    setMensajes((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const extra = [];
      if (reaccionTexto) extra.push({ from: "bot", text: reaccionTexto });
      if (siguienteIdx < STEPS.length) {
        extra.push({ from: "bot", text: STEPS[siguienteIdx].prompt(nuevasRespuestas) });
        setPasoIdx(siguienteIdx);
      } else {
        navigate("/matching", { state: nuevasRespuestas });
      }
      setMensajes((prev) => [...prev, ...extra]);
    }, 400);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    const limpio = inputTexto.trim();
    if (stepActual.key === "name" && limpio.length < 2) return;
    avanzar(limpio, limpio);
  };

  if (checkingSession) return null;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 md:px-12 py-5 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <Mascota size={36} />
          <span className="font-title text-lg font-semibold text-kallpa-coral-dark">Kallpa</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#login"
            className="text-sm text-kallpa-coral-dark/70 hover:text-kallpa-coral-dark transition px-3 py-2"
          >
            Iniciar sesión
          </a>
          <a
            href="#login"
            className="text-sm font-medium bg-kallpa-coral text-white rounded-full px-5 py-2 hover:opacity-90 transition"
          >
            Crear cuenta
          </a>
        </div>
      </motion.nav>

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-8 pb-24 grid md:grid-cols-2 gap-12 items-start">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.h1
            variants={fadeUp}
            className="font-title text-4xl md:text-5xl font-semibold text-kallpa-coral-dark leading-tight mb-4"
          >
            Nadie carga solo su ciclo.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-kallpa-text/80 leading-relaxed mb-6 max-w-md">
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
          className="bg-white rounded-3xl border border-kallpa-coral/15 shadow-lg shadow-kallpa-coral/10 flex flex-col h-[560px] max-h-[75vh]"
        >
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
            {mensajes.map((m, i) =>
              m.from === "bot" ? (
                <ChatBubble key={i}>{m.text}</ChatBubble>
              ) : (
                <div key={i} className="flex justify-end mb-4">
                  <div className="bg-kallpa-coral text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[75%]">
                    {m.text}
                  </div>
                </div>
              )
            )}
            {escribiendo && mensajes.length === 0 && (
              <ChatBubble>
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-kallpa-coral-dark/40 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-kallpa-coral-dark/40 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-kallpa-coral-dark/40 animate-bounce" />
                </span>
              </ChatBubble>
            )}
          </div>

          <div className="border-t border-kallpa-coral/10 p-4">
            {stepActual?.type === "choice" && (
              <div className="flex flex-wrap gap-2">
                {stepActual.opciones.map((op) => (
                  <button
                    key={op.valor}
                    onClick={() => avanzar(op.valor, op.label)}
                    className="text-sm border border-kallpa-coral/25 text-kallpa-coral-dark rounded-full px-4 py-2 hover:bg-kallpa-coral/10 transition"
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            )}

            {stepActual?.type === "carrera" && (
              <div>
                <CarreraInput
                  value={inputTexto}
                  onChange={setInputTexto}
                />
                <button
                  onClick={() => inputTexto.trim() && avanzar(inputTexto.trim(), inputTexto.trim())}
                  disabled={!inputTexto.trim()}
                  className="mt-2 w-full rounded-xl bg-kallpa-coral text-white py-2.5 text-sm font-medium disabled:opacity-40"
                >
                  Enviar
                </button>
              </div>
            )}

            {stepActual?.type === "text" && (
              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <input
                  type="text"
                  inputMode={stepActual.numeric ? "numeric" : "text"}
                  value={inputTexto}
                  onChange={(e) => {
                    const val = stepActual.numeric
                      ? e.target.value.replace(/[^0-9]/g, "")
                      : e.target.value;
                    setInputTexto(val);
                  }}
                  placeholder={stepActual.placeholder}
                  autoFocus
                  className="flex-1 rounded-xl border border-kallpa-coral/20 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-kallpa-teal"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-kallpa-coral text-white px-5 py-2.5 text-sm font-medium"
                >
                  Enviar
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </main>

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
            <motion.div key={step.n} variants={fadeUp} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 border border-kallpa-coral/10">
              <span className="font-title text-3xl text-kallpa-coral/40">{step.n}</span>
              <h3 className="font-medium text-kallpa-coral-dark mt-3 mb-2">{step.t}</h3>
              <p className="text-sm text-kallpa-text/70 leading-relaxed">{step.d}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

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

      <footer className="text-center py-8 text-xs text-kallpa-text/40">
        Kallpa — Hackathon Global para Niñas en STEM, 2026
      </footer>
    </div>
  );
}