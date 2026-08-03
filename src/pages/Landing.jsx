import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Mascota from "../components/Mascota";
import { login } from "../lib/auth";

export default function Landing() {
  const [name, setName] = useState("");
  const [carrera, setCarrera] = useState("");
  const [ciclo, setCiclo] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    login({ name, carrera, ciclo });
    navigate("/app");
  };

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Mascota size={36} />
          <span className="font-title text-lg font-semibold text-kallpa-coral-dark">
            Kallpa
          </span>
        </div>
        <a
          href="#login"
          className="text-sm text-kallpa-coral-dark/70 hover:text-kallpa-coral-dark transition"
        >
          Iniciar sesión
        </a>
      </nav>

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-8 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-title text-4xl md:text-5xl font-semibold text-kallpa-coral-dark leading-tight mb-4">
            Nadie carga solo su ciclo.
          </h1>
          <p className="text-lg text-kallpa-text/80 leading-relaxed mb-6 max-w-md">
            Kallpa te conecta con un pequeño grupo de estudiantes que están
            pasando por la misma sobrecarga que tú. Check-ins rápidos,
            apoyo real, y micro-retos de descanso entre pares.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-kallpa-coral-dark/70">
            <span className="bg-white/60 rounded-full px-4 py-1.5">
              Grupos de 3 a 5 personas
            </span>
            <span className="bg-white/60 rounded-full px-4 py-1.5">
              Sin presión, sin evaluación
            </span>
            <span className="bg-white/60 rounded-full px-4 py-1.5">
              Apoyo generado con IA
            </span>
          </div>
        </div>

        <form
          id="login"
          onSubmit={handleLogin}
          className="bg-white rounded-3xl border border-kallpa-coral/15 p-8 shadow-sm"
        >
          <h2 className="font-title text-xl font-semibold text-kallpa-coral-dark mb-1">
            Entra a tu mancha
          </h2>
          <p className="text-sm text-kallpa-text/60 mb-6">
            Demo — no necesitas contraseña, solo cuéntanos quién eres.
          </p>

          <label className="block text-sm text-kallpa-coral-dark/70 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-xl border border-kallpa-coral/20 px-3 py-2.5 text-sm mb-4 outline-none focus:ring-2 focus:ring-kallpa-teal"
            required
          />

          <label className="block text-sm text-kallpa-coral-dark/70 mb-1">
            Carrera
          </label>
          <input
            type="text"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            placeholder="Ej: Ingeniería, Medicina..."
            className="w-full rounded-xl border border-kallpa-coral/20 px-3 py-2.5 text-sm mb-4 outline-none focus:ring-2 focus:ring-kallpa-teal"
          />

          <label className="block text-sm text-kallpa-coral-dark/70 mb-1">
            Ciclo actual
          </label>
          <input
            type="text"
            value={ciclo}
            onChange={(e) => setCiclo(e.target.value)}
            placeholder="Ej: 6"
            className="w-full rounded-xl border border-kallpa-coral/20 px-3 py-2.5 text-sm mb-6 outline-none focus:ring-2 focus:ring-kallpa-teal"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-kallpa-coral text-white py-3 font-medium hover:opacity-90 transition"
          >
            Entrar a Kallpa
          </button>
        </form>
      </main>
    </div>
  );
}
