import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";

export default function MicroChallenge({ reto, totalIntegrantes, userId }) {
  const [completados, setCompletados] = useState(0);
  const [yaCompleto, setYaCompleto] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured || !reto?.id) return;
    (async () => {
      const { data } = await supabase
        .from("challenge_completions")
        .select("user_id")
        .eq("challenge_id", reto.id);
      setCompletados(data?.length || 0);
      setYaCompleto(Boolean(data?.some((c) => c.user_id === userId)));
    })();
  }, [reto?.id, userId]);

  const marcarCompletado = async () => {
    if (!supabaseConfigured || yaCompleto) return;
    await supabase.from("challenge_completions").insert({ challenge_id: reto.id, user_id: userId });
    setCompletados((c) => c + 1);
    setYaCompleto(true);
  };

  const total = totalIntegrantes || 1;

  return (
    <div className="bg-kallpa-teal/20 rounded-3xl p-5">
      <p className="text-xs uppercase tracking-wide text-kallpa-teal-dark/60 mb-2">
        Reto de la semana
      </p>
      <p className="text-sm font-medium text-kallpa-teal-dark mb-3">{reto.titulo}</p>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-2 rounded-full bg-white/60 overflow-hidden">
          <div
            className="h-full bg-kallpa-teal transition-all"
            style={{ width: `${Math.min((completados / total) * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs text-kallpa-teal-dark/70">
          {completados}/{total}
        </span>
      </div>
      <button
        onClick={marcarCompletado}
        disabled={yaCompleto}
        className="text-xs font-medium text-kallpa-teal-dark underline disabled:opacity-50 disabled:no-underline"
      >
        {yaCompleto ? "Ya marcaste el tuyo ✓" : "Marcar como cumplido"}
      </button>
    </div>
  );
}
