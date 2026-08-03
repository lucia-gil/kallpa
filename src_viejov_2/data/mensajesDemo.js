// Mensajes de respaldo para cuando no hay API key configurada (modo demo).
// Redactados con el mismo tono que le pediríamos a Claude: cálido, cercano,
// sin sonar clínico, terminando en un micro-reto de descanso.

export const mensajesDemo = [
  "Esta semana varios en tu mancha reportaron estar cansados por los parciales — no eres la única. Entre todos, intenten esta semana dormir al menos 7 horas, aunque sea un solo día.",
  "Se nota que la carga ha estado pesada últimamente. Recuerda que no tienes que resolverlo todo hoy. Un reto simple para el grupo: cada uno se desconecta 30 minutos sin pantalla antes de dormir.",
  "Tu grupo ha tenido una semana intensa, pero también se apoyaron entre ustedes, y eso ya es mucho. Prueben este reto: mándense un mensaje random que no sea de tarea, solo para saludarse.",
  "Notamos que el ánimo del grupo bajó un poco esta semana. Está bien no estar al 100%. Micro-reto: hoy cada uno se toma 10 minutos de pausa real, sin sentirse culpable por eso.",
];

export function getMensajeDemo(seed = 0) {
  return mensajesDemo[seed % mensajesDemo.length];
}
