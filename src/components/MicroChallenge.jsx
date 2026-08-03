export default function MicroChallenge({ reto, grupo }) {
  const progreso = reto.completados.length;
  const total = grupo.integrantes.length;

  return (
    <div className="bg-kallpa-teal/15 rounded-3xl shadow-card p-6">
      <p className="text-xs uppercase tracking-widest text-kallpa-teal-dark/60 font-semibold mb-2">
        Reto de la semana
      </p>
      <p className="font-display text-lg text-kallpa-teal-dark mb-4">{reto.titulo}</p>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 rounded-full bg-white/70 overflow-hidden">
          <div
            className="h-full rounded-full bg-kallpa-teal transition-all duration-500"
            style={{ width: `${(progreso / total) * 100}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-kallpa-teal-dark/70 tabular-nums">
          {progreso}/{total}
        </span>
      </div>
    </div>
  );
}
