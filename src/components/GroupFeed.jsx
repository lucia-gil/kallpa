const MOOD_EMOJI = { bien: "🙂", ok: "😐", cansada: "😔" };

export default function GroupFeed({ grupo, checkins }) {
  const byUser = (id) => grupo.integrantes.find((m) => m.id === id);

  return (
    <div className="bg-white rounded-3xl border border-kallpa-coral/20 p-5">
      <p className="text-xs uppercase tracking-wide text-kallpa-text/50 mb-3">
        Cómo está tu mancha
      </p>
      <div className="space-y-3">
        {checkins.map((c) => {
          const user = byUser(c.userId);
          const colorBg = user.color === "teal" ? "bg-kallpa-teal/30" : "bg-kallpa-coral/30";
          return (
            <div key={c.id} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${colorBg}`}
              >
                {user.initials}
              </div>
              <p className="text-sm text-kallpa-text/80">
                <span className="font-medium">{user.name}</span>{" "}
                {MOOD_EMOJI[c.mood]} — {c.nota}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
