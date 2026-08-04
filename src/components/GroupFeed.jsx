import MoodIcon from "./MoodIcon";

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
            <div key={c.id} className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-kallpa-teal/30 flex-shrink-0">
                {c.profiles?.initials || "?"}
              </div>
              <p className="text-sm text-kallpa-text/80 flex flex-wrap items-center gap-1.5 min-w-0">
                <span className="font-medium">{c.profiles?.name || "Alguien"}</span>
                <MoodIcon type={c.mood} className="w-5 h-5 flex-shrink-0" />
                {c.nota && <span className="break-words min-w-0">— {c.nota}</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
