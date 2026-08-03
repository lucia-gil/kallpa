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
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-kallpa-coral" />
        <h1 className="text-xl font-medium text-kallpa-coral-dark">{grupo.nombre}</h1>
      </div>

      <div className="space-y-4">
        <CheckIn onSubmit={handleCheckIn} />
        <GroupFeed grupo={grupo} checkins={checkins} />
        <MicroChallenge reto={microReto} grupo={grupo} />
        <AIMessage checkins={checkins} grupoNombre={grupo.nombre} />
      </div>
    </div>
  );
}
