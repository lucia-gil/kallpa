export default function MicroChallenge({ reto, grupo }) {
  const progreso = reto.completados.length;
  const total = grupo.integrantes.length;

  return (
    <div className="bg-kallpa-teal/20 rounded-3xl p-5">
      <p className="text-xs uppercase tracking-wide text-kallpa-teal-dark/60 mb-2">
        Reto de la semana
      </p>
      <p className="text-sm font-medium text-kallpa-teal-dark mb-3">{reto.titulo}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-white/60 overflow-hidden">
          <div
            className="h-full bg-kallpa-teal"
            style={{ width: `${(progreso / total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-kallpa-teal-dark/70">
          {progreso}/{total}
        </span>
      </div>
    </div>
  );
}
