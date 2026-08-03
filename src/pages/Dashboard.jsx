import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckIn from "../components/CheckIn";
import GroupFeed from "../components/GroupFeed";
import MicroChallenge from "../components/MicroChallenge";
import AIMessage from "../components/AIMessage";
import Mascota from "../components/Mascota";
import { grupo, checkins as seedCheckins, microReto } from "../data/seed";
import { getSession, logout } from "../lib/auth";

export default function Dashboard() {
  const [checkins, setCheckins] = useState(seedCheckins);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate("/");
      return;
    }
    setUser(session);
  }, [navigate]);

  const handleCheckIn = ({ mood, nota }) => {
    setCheckins([
      ...checkins,
      { id: `c${Date.now()}`, userId: user.id, mood, nota, fecha: "hoy" },
    ]);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-kallpa-coral/10 bg-white/40">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mascota size={32} />
            <span className="font-title font-semibold text-kallpa-coral-dark">
              Kallpa
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-kallpa-text/70 hidden sm:inline">
              Hola, {user.name.split(" ")[0]}
            </span>
            <div className="w-8 h-8 rounded-full bg-kallpa-coral/30 flex items-center justify-center text-xs font-medium text-kallpa-coral-dark">
              {user.initials}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-kallpa-text/50 hover:text-kallpa-text/80 transition"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        <div className="mb-8">
          <p className="text-sm text-kallpa-coral-dark/60 uppercase tracking-wide mb-1">
            {grupo.nombre}
          </p>
          <h1 className="font-title text-3xl font-semibold text-kallpa-coral-dark">
            Tu pausa entre ciclos
          </h1>
        </div>

        <div className="grid md:grid-cols-[1fr_1.1fr] gap-6">
          <div className="space-y-6">
            <CheckIn onSubmit={handleCheckIn} />
            <MicroChallenge reto={microReto} grupo={grupo} />
          </div>
          <div className="space-y-6">
            <GroupFeed grupo={grupo} checkins={checkins} />
            <AIMessage checkins={checkins} grupoNombre={grupo.nombre} />
          </div>
        </div>
      </main>
    </div>
  );
}
