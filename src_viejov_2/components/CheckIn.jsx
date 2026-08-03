import { useState } from "react";

const MOODS = [
  { key: "bien", emoji: "🙂", bg: "bg-green-100", text: "text-green-800" },
  { key: "ok", emoji: "😐", bg: "bg-amber-100", text: "text-amber-800" },
  { key: "cansada", emoji: "😔", bg: "bg-orange-100", text: "text-orange-800" },
];

export default function CheckIn({ onSubmit }) {
  const [mood, setMood] = useState(null);
  const [nota, setNota] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = () => {
    if (!mood) return;
    onSubmit({ mood, nota });
    setMood(null);
    setNota("");
    setEnviado(true);
    setTimeout(() => setEnviado(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-kallpa-coral/20 p-5">
      <p className="text-sm text-kallpa-text/70 mb-4">
        Antes de seguir con todo, respira un momento.
      </p>
      <div className="flex gap-3 mb-4">
        {MOODS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMood(m.key)}
            className={`flex-1 rounded-2xl py-4 text-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${m.bg} ${
              mood === m.key ? "ring-2 ring-kallpa-coral scale-110" : ""
            }`}
          >
            {m.emoji}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        placeholder="¿Algo que quieras contar? (opcional)"
        className="w-full rounded-xl border border-kallpa-coral/20 px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-kallpa-teal"
      />
      {enviado && (
        <p className="text-sm text-kallpa-teal-dark bg-kallpa-teal/20 rounded-xl px-3 py-2 mb-3 text-center">
          Compartido con tu mancha
        </p>
      )}
      <button
        onClick={handleSubmit}
        disabled={!mood}
        className="w-full rounded-xl bg-kallpa-coral text-white py-2.5 font-medium disabled:opacity-40"
      >
        Compartir con tu mancha
      </button>
    </div>
  );
}
