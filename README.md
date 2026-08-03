# Kallpa 🦙

**Tu pausa entre ciclos.**

Kallpa es una app que combate el burnout académico en universitarios peruanos
mediante pequeños grupos de apoyo entre pares (3-5 personas), check-ins
emocionales rápidos, mensajes de apoyo generados con IA, y micro-retos
colectivos de bienestar.

Proyecto creado para el **Hackathon Global para Niñas en STEM**.

## El problema

En el Perú, más de 1.1 millones de estudiantes de pregrado enfrentan una
crisis de salud mental poco visibilizada. Estudios en universidades de Lima
reportan que el 31.4% de los estudiantes padece burnout académico severo,
mientras que en universidades del sur y oriente del país la prevalencia de
burnout moderado llega hasta el 67.7%. El aislamiento social es un factor
de riesgo consistentemente documentado — sin embargo, solo el 21.2% de los
estudiantes accede a servicios de bienestar universitario.

Kallpa no reemplaza la atención clínica: propone un modelo complementario,
horizontal, que reduce el aislamiento como primera línea de apoyo.

## Cómo funciona

1. **Matching por carga académica** — te agrupamos con estudiantes en tu
   misma situación (carrera, ciclo, nivel de sobrecarga)
2. **Check-in rápido** — comparte cómo va tu semana con 3 emojis y una nota
   corta, sin presión
3. **Mensaje de IA semanal** — la app analiza el estado del grupo y genera
   un mensaje empático, no un consejo clínico
4. **Micro-retos colectivos** — pequeñas metas de bienestar en equipo
   (dormir mejor, desconectar), nunca de productividad

## Stack técnico

- **Frontend:** React + Vite + Tailwind CSS v4
- **IA:** API de Claude (Anthropic) para los mensajes semanales empáticos
- **Backend planeado:** Supabase (auth + base de datos + realtime)
- **Hosting:** Vercel

## Correr el proyecto localmente

```bash
npm install
cp .env.example .env
# agrega tu API key de Anthropic en .env
npm run dev
```

Consigue tu API key en [console.anthropic.com](https://console.anthropic.com).

## Estado del proyecto (MVP de hackathon)

- [x] Check-in de mood + feed de grupo
- [x] Micro-reto colectivo con progreso
- [x] Mensaje semanal generado con IA (Claude API)
- [x] Datos de prueba (seed data) para demo
- [ ] Autenticación real (Supabase Auth)
- [ ] Matching real con base de datos
- [ ] Notificaciones
- [ ] Detección de burnout severo con derivación a servicios de bienestar

## Nota de seguridad

La llamada a la API de Claude se hace desde el frontend por simplicidad de
demo del hackathon. Para producción, esta llamada debe moverse a un backend
(función serverless) para no exponer la API key en el navegador.

## Equipo

Hackathon Global para Niñas en STEM — 2026

## Licencia

MIT
