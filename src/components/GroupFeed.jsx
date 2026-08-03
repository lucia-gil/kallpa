const MOOD_EMOJI = { bien: "🙂", ok: "😐", cansada: "😔" };

export default function GroupFeed({ checkins }) {
  return (
    <div className="bg-white rounded-3xl border border-kallpa-coral/20 p-5">
      <p className="text-xs uppercase tracking-wide text-kallpa-text/50 mb-3">
        Cómo está tu mancha
      </p>
      {checkins.length === 0 ? (
        <p className="text-sm text-kallpa-text/50">
          Todavía nadie ha compartido cómo está esta semana.
        </p>
      ) : (
        <div className="space-y-3">
          {checkins.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-kallpa-teal/30">
                {c.profiles?.initials || "?"}
              </div>
              <p className="text-sm text-kallpa-text/80">
                <span className="font-medium">{c.profiles?.name || "Alguien"}</span>{" "}
                {MOOD_EMOJI[c.mood]} {c.nota && `— ${c.nota}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
