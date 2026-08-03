const MOOD_EMOJI = { bien: "🙂", ok: "😐", cansada: "😔" };

export default function GroupFeed({ grupo, checkins }) {
  const byUser = (id) => grupo.integrantes.find((m) => m.id === id);

  return (
    <div className="bg-white rounded-3xl shadow-card p-6">
      <p className="text-xs uppercase tracking-widest text-kallpa-text/45 font-semibold mb-4">
        Cómo está tu mancha
      </p>
      <div className="space-y-4">
        {checkins.map((c) => {
          const user = byUser(c.userId);
          if (!user) return null;
          const colorBg = user.color === "teal" ? "bg-kallpa-teal/30" : "bg-kallpa-coral/30";
          return (
            <div key={c.id} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${colorBg}`}
              >
                {user.initials}
              </div>
              <p className="text-sm text-kallpa-text/80 leading-snug">
                <span className="font-semibold text-kallpa-coral-dark">{user.name}</span>{" "}
                {MOOD_EMOJI[c.mood]} — {c.nota}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
