import { useState, useRef, useEffect } from "react";

const CARRERAS = [
  "Administración de Empresas",
  "Administración de Negocios Internacionales",
  "Administración Hotelera y de Turismo",
  "Administración y Gerencia",
  "Antropología",
  "Arqueología",
  "Arquitectura",
  "Biología",
  "Ciencias de la Computación",
  "Ciencias de la Comunicación",
  "Ciencias Políticas",
  "Contabilidad",
  "Comunicación Audiovisual",
  "Derecho",
  "Diseño de Interiores",
  "Diseño Gráfico",
  "Diseño Industrial",
  "Economía",
  "Educación Especial",
  "Educación Inicial",
  "Educación Primaria",
  "Educación Secundaria",
  "Enfermería",
  "Estadística",
  "Farmacia y Bioquímica",
  "Filosofía",
  "Finanzas",
  "Física",
  "Genética y Biotecnología",
  "Geografía",
  "Historia",
  "Ingeniería Agroindustrial",
  "Ingeniería Agrónoma",
  "Ingeniería Ambiental",
  "Ingeniería Biomédica",
  "Ingeniería Civil",
  "Ingeniería de la Energía",
  "Ingeniería de las Telecomunicaciones",
  "Ingeniería de Minas",
  "Ingeniería de Sistemas",
  "Ingeniería de Software",
  "Ingeniería de Transportes",
  "Ingeniería Eléctrica",
  "Ingeniería Electrónica",
  "Ingeniería en Ciberseguridad",
  "Ingeniería Geográfica",
  "Ingeniería Geológica",
  "Ingeniería Industrial",
  "Ingeniería Mecánica",
  "Ingeniería Mecatrónica",
  "Ingeniería Metalúrgica",
  "Ingeniería Naval",
  "Ingeniería Química",
  "Ingeniería Sanitaria",
  "Ingeniería Textil",
  "Lingüística",
  "Literatura",
  "Marketing",
  "Matemática",
  "Medicina Humana",
  "Medicina Veterinaria",
  "Microbiología y Parasitología",
  "Nutrición",
  "Obstetricia",
  "Odontología",
  "Periodismo",
  "Psicología",
  "Publicidad",
  "Química",
  "Sociología",
  "Tecnología Médica",
  "Terapia Física y Rehabilitación",
  "Trabajo Social",
  "Traducción e Interpretación",
];

export default function CarreraInput({ value, onChange }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const manejarCierre = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    };
    const manejarTeclado = (e) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", manejarCierre);
    document.addEventListener("keydown", manejarTeclado);
    return () => {
      document.removeEventListener("mousedown", manejarCierre);
      document.removeEventListener("keydown", manejarTeclado);
    };
  }, []);

  const filtradas = value
    ? CARRERAS.filter((c) => c.toLowerCase().includes(value.toLowerCase())).slice(0, 6)
    : [];

  return (
    <div style={{ position: "relative", width: "100%" }} ref={ref}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setAbierto(true);
        }}
        onFocus={() => setAbierto(true)}
        placeholder="Escribe para buscar tu carrera..."
        className="w-full rounded-xl border border-kallpa-coral/20 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-kallpa-teal text-kallpa-text bg-white"
        autoComplete="off"
      />

      {abierto && filtradas.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            maxHeight: "200px",
            overflowY: "auto",
          }}
          className="bg-white border border-kallpa-coral/20 rounded-xl shadow-xl"
        >
          {filtradas.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onChange(c);
                setAbierto(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-kallpa-coral-dark hover:bg-kallpa-coral/10 transition block"
            >
              {c}
            </button>
          ))}
          {value && !CARRERAS.some((c) => c.toLowerCase() === value.toLowerCase()) && (
            <div className="px-3 py-2 text-xs text-kallpa-text/50 border-t border-kallpa-coral/10 bg-gray-50">
              No está en la lista, se usará "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}