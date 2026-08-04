import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CheckIn from "../components/CheckIn";
import GroupFeed from "../components/GroupFeed";
import MicroChallenge from "../components/MicroChallenge";
import AIMessage from "../components/AIMessage";
import Meditar from "../components/Meditar";
import SupportChat from "../components/SupportChat";
import Mascota from "../components/Mascota";
import { getSession, logout } from "../lib/auth";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { grupo as grupoDemo, checkins as checkinsDemo, microReto as retoDemo } from "../data/seed";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [integrantes, setIntegrantes] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [reto, setReto] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let checkinsChannel;

    (async () => {
      const session = await getSession();
      if (!session) {
        navigate("/");
        return;
      }
      setUser(session);

      if (!supabaseConfigured) {
        // Modo demo offline sin Supabase configurado
        setGrupo(grupoDemo);
        setIntegrantes(grupoDemo.integrantes);
        setCheckins(checkinsDemo);
        setReto(retoDemo);
        setLoading(false);
        return;
      }

      const groupId = location.state?.groupId || session.group_id;
      if (!groupId) {
        navigate("/");
        return;
      }

      const [{ data: g }, { data: miembros }, { data: chks }, { data: retos }] = await Promise.all([
        supabase.from("groups").select("*").eq("id", groupId).single(),
        supabase.from("profiles").select("id, name, initials").eq("group_id", groupId),
        supabase
          .from("checkins")
          .select("id, mood, nota, created_at, user_id, profiles(name, initials)")
          .eq("group_id", groupId)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase.from("challenges").select("*").eq("group_id", groupId).limit(1),
      ]);

      setGrupo(g);
      setIntegrantes(miembros || []);
      setCheckins(chks || []);
      setReto(retos?.[0] || null);
      setLoading(false);

      // Suscripción en tiempo real: nuevos check-ins del grupo aparecen solos
      checkinsChannel = supabase
        .channel(`checkins-${groupId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "checkins", filter: `group_id=eq.${groupId}` },
          async (payload) => {
            const { data: autor } = await supabase
              .from("profiles")
              .select("name, initials")
              .eq("id", payload.new.user_id)
              .single();
            setCheckins((prev) => [{ ...payload.new, profiles: autor }, ...prev]);
          }
        )
        .subscribe();
    })();

    return () => {
      if (checkinsChannel) supabase.removeChannel(checkinsChannel);
    };
  }, [navigate, location.state]);

  const handleCheckIn = async ({ mood, nota }) => {
    if (!supabaseConfigured) {
      setCheckins([
        { id: `c${Date.now()}`, user_id: user.id, mood, nota, profiles: { name: user.name, initials: user.initials } },
        ...checkins,
      ]);
      return;
    }
    await supabase.from("checkins").insert({
      group_id: grupo.id,
      user_id: user.id,
      mood,
      nota,
    });
    // El propio insert también llega por el canal realtime, no hace falta duplicar el estado local
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading || !user || !grupo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Mascota size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-kallpa-coral/10 bg-white/40"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mascota size={32} />
            <span className="font-title font-semibold text-kallpa-coral-dark">Kallpa</span>
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
      </motion.header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-sm text-kallpa-coral-dark/60 uppercase tracking-wide mb-1">
            {grupo.name}
          </p>
          <h1 className="font-title text-3xl font-semibold text-kallpa-coral-dark">
            Tu pausa entre ciclos
          </h1>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={stagger} className="grid md:grid-cols-[1fr_1.1fr] gap-6">
          <div className="space-y-6">
            <motion.div variants={fadeUp}><CheckIn onSubmit={handleCheckIn} /></motion.div>
            <motion.div variants={fadeUp}><Meditar /></motion.div>
            {reto && (
              <motion.div variants={fadeUp}>
                <MicroChallenge reto={reto} totalIntegrantes={integrantes.length} userId={user.id} />
              </motion.div>
            )}
          </div>
          <div className="space-y-6">
            <motion.div variants={fadeUp}><GroupFeed checkins={checkins} /></motion.div>
            <motion.div variants={fadeUp}><AIMessage checkins={checkins} grupoNombre={grupo.name} /></motion.div>
          </div>
        </motion.div>
      </main>
      <SupportChat userId={user.id} />
    </div>
  );
}
