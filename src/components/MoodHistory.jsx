import MoodIcon from "./MoodIcon";

function formatearFecha(fecha) {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

export default function MoodHistory({ checkins, userId }) {
  const misCheckins = checkins
    .filter((c) => (c.user_id ?? c.userId) === userId)
    .slice()
    .sort((a, b) => new Date(a.created_at ?? a.fecha) - new Date(b.created_at ?? b.fecha));

  return (
    <div className="bg-white rounded-3xl border border-kallpa-coral/20 p-5 min-w-0">
      <p className="text-xs uppercase tracking-wide text-kallpa-text/50 mb-1">Tu historial</p>

      {misCheckins.length === 0 ? (
        <p className="text-sm text-kallpa-text/50">
          Aún no tienes check-ins. Comparte cómo te sientes arriba para empezar tu historial.
        </p>
      ) : (
        <>
          <p className="text-sm text-kallpa-text/70 mb-3">
            {misCheckins.length} check-in{misCheckins.length === 1 ? "" : "s"} registrado
            {misCheckins.length === 1 ? "" : "s"}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {misCheckins.map((c) => (
              <div key={c.id} className="flex flex-col items-center flex-shrink-0 w-12">
                <MoodIcon type={c.mood} className="w-9 h-9" />
                <span className="text-[10px] text-kallpa-text/50 mt-1 whitespace-nowrap">
                  {formatearFecha(c.created_at ?? c.fecha)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
