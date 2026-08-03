import { useState } from "react";

const MOODS = [
  { key: "bien", emoji: "🙂", bg: "bg-green-100", text: "text-green-800" },
  { key: "ok", emoji: "😐", bg: "bg-amber-100", text: "text-amber-800" },
  { key: "cansada", emoji: "😔", bg: "bg-orange-100", text: "text-orange-800" },
];

export default function CheckIn({ onSubmit }) {
  const [mood, setMood] = useState(null);
  const [nota, setNota] = useState("");

  const handleSubmit = () => {
    if (!mood) return;
    onSubmit({ mood, nota });
    setMood(null);
    setNota("");
  };

  return (
    <div className="bg-white rounded-3xl shadow-card p-6">
      <p className="font-display text-lg text-kallpa-coral-dark mb-5">
        Antes de seguir con todo, respira un momento.
      </p>
      <div className="flex gap-3 mb-4">
        {MOODS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMood(m.key)}
            className={`flex-1 rounded-2xl py-4 text-2xl transition-all duration-150 ${m.bg} ${
              mood === m.key
                ? "ring-2 ring-kallpa-coral ring-offset-2 ring-offset-white scale-105"
                : "hover:scale-[1.03]"
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
        className="w-full rounded-xl border border-kallpa-coral/20 bg-kallpa-cream/40 px-3.5 py-2.5 text-sm mb-4 outline-none transition focus:border-kallpa-teal focus:ring-2 focus:ring-kallpa-teal/40"
      />
      <button
        onClick={handleSubmit}
        disabled={!mood}
        className={`w-full rounded-xl py-3 font-semibold transition-all ${
          mood
            ? "bg-kallpa-coral text-white shadow-card hover:brightness-105 active:scale-[0.98]"
            : "bg-kallpa-coral/10 text-kallpa-coral-dark/35 cursor-not-allowed"
        }`}
      >
        Compartir con tu mancha
      </button>
    </div>
  );
}
