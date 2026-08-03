import { useState } from "react";
import CheckIn from "../components/CheckIn";
import GroupFeed from "../components/GroupFeed";
import MicroChallenge from "../components/MicroChallenge";
import AIMessage from "../components/AIMessage";
import { currentUser, grupo, checkins as seedCheckins, microReto } from "../data/seed";

export default function Home() {
  const [checkins, setCheckins] = useState(seedCheckins);

  const handleCheckIn = ({ mood, nota }) => {
    setCheckins([
      ...checkins,
      { id: `c${Date.now()}`, userId: currentUser.id, mood, nota, fecha: "hoy" },
    ]);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto px-5 py-10">
        <header className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-kallpa-coral shadow-card flex items-center justify-center text-white text-sm font-semibold font-display">
            {grupo.nombre.charAt(0)}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-kallpa-coral-dark/50 font-medium">
              Kallpa
            </p>
            <h1 className="text-2xl font-display font-medium text-kallpa-coral-dark leading-tight">
              {grupo.nombre}
            </h1>
          </div>
        </header>

        <div className="space-y-5">
          <CheckIn onSubmit={handleCheckIn} />
          <GroupFeed grupo={grupo} checkins={checkins} />
          <MicroChallenge reto={microReto} grupo={grupo} />
          <AIMessage checkins={checkins} grupoNombre={grupo.nombre} />
        </div>
      </div>
    </div>
  );
}
