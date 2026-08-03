// Datos de prueba para demo. En producción esto viene de Supabase.

export const currentUser = {
  id: "u1",
  name: "Tú",
  initials: "TU",
  carrera: "Ingeniería",
  ciclo: 6,
};

export const grupo = {
  id: "g1",
  nombre: "Tu mancha",
  integrantes: [
    { id: "u1", name: "Tú", initials: "TU", color: "coral" },
    { id: "u2", name: "María", initials: "MJ", color: "teal" },
    { id: "u3", name: "Luis", initials: "LC", color: "coral" },
    { id: "u4", name: "Andrea", initials: "AR", color: "teal" },
  ],
};

export const checkins = [
  { id: "c1", userId: "u2", mood: "cansada", nota: "Semana pesada, parciales", fecha: "2026-08-01" },
  { id: "c2", userId: "u3", mood: "ok", nota: "Igual, ánimo equipo", fecha: "2026-08-01" },
  { id: "c3", userId: "u4", mood: "bien", nota: "Mejor que la semana pasada", fecha: "2026-08-02" },
];

export const microReto = {
  id: "r1",
  titulo: "Esta semana el grupo intenta dormir 7 horas",
  completados: ["u2", "u4"],
  total: 4,
};
