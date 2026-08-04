import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { generarRespuestaApoyo } from "../lib/gemini";

const SALUDO_INICIAL = { rol: "bot", texto: "Hola, soy Kallpa 🌱 ¿Cómo te sientes hoy?" };

export default function SupportChat() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([SALUDO_INICIAL]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const finRef = useRef(null);

  useEffect(() => {
    if (abierto) finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, abierto]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    const texto = input.trim();
    if (!texto || cargando) return;

    const historial = [...mensajes, { rol: "usuario", texto }];
    setMensajes(historial);
    setInput("");
    setCargando(true);

    const respuesta = await generarRespuestaApoyo(historial);
    setMensajes((prev) => [...prev, { rol: "bot", texto: respuesta.texto, tipo: respuesta.tipo }]);
    setCargando(false);
  };

  const panel = abierto && (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col w-80 h-[480px] max-h-[70vh] bg-kallpa-cream rounded-3xl shadow-xl overflow-hidden border border-kallpa-teal/20">
      <div className="bg-kallpa-teal-dark px-4 py-3 flex items-center justify-between">
        <h2 className="font-title text-kallpa-cream text-lg">Kallpa</h2>
        <button
          onClick={() => setAbierto(false)}
          aria-label="Cerrar chat"
          className="text-kallpa-cream/70 hover:text-kallpa-cream text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {mensajes.map((m, i) => (
          <div key={i} className={`flex ${m.rol === "usuario" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm whitespace-pre-line ${
                m.rol === "usuario"
                  ? "bg-kallpa-coral text-white rounded-br-sm"
                  : m.tipo === "crisis"
                  ? "bg-red-50 border border-red-200 text-red-900 rounded-bl-sm"
                  : "bg-kallpa-teal/20 text-kallpa-text rounded-bl-sm"
              }`}
            >
              {m.texto}
            </div>
          </div>
        ))}
        {cargando && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-kallpa-teal/20 text-kallpa-text text-sm">
              Kallpa está escribiendo...
            </div>
          </div>
        )}
        <div ref={finRef} />
      </div>

      <form onSubmit={enviarMensaje} className="flex gap-2 p-3 border-t border-kallpa-teal/20">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe cómo te sientes..."
          className="flex-1 px-3 py-2 rounded-full border border-kallpa-teal/30 text-sm outline-none focus:ring-2 focus:ring-kallpa-teal"
        />
        <button
          type="submit"
          disabled={cargando}
          className="bg-kallpa-coral text-white px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );

  return createPortal(
    <>
      {panel}
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar chat de apoyo" : "Abrir chat de apoyo"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-kallpa-coral text-white text-2xl shadow-lg hover:opacity-90 transition flex items-center justify-center"
      >
        {abierto ? "✕" : "💬"}
      </button>
    </>,
    document.body
  );
}
