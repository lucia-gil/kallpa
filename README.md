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

## Estructura de la web

- `/` — landing pública con login demo (sin contraseña, solo nombre/carrera/ciclo)
- `/app` — dashboard, layout de dos columnas para escritorio, requiere sesión

La sesión demo se guarda en `localStorage` del navegador — no hay backend
de autenticación real todavía (ver roadmap).

## Conectar Supabase (base de datos real)

1. Crea un proyecto en [supabase.com](https://supabase.com) (gratis)
2. Ve a **SQL Editor** → **New query**, pega el contenido completo de
   `supabase/schema.sql` y ejecútalo
3. Ve a **Authentication → Providers** y activa **Anonymous Sign-Ins**
   (así el login demo no pide contraseña, pero crea sesiones reales)
4. Ve a **Settings → API**, copia la `Project URL` y la `anon public key`
5. Pégalas en tu `.env`:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```

**Si no configuras Supabase**, la app sigue funcionando en modo demo con
`localStorage` y datos de prueba — no es obligatorio para correr el proyecto.

### Qué se sincroniza en tiempo real
Los check-ins usan Supabase Realtime: si dos personas entran a la misma
mancha (misma carrera/ciclo) desde dispositivos distintos, cada una ve el
check-in de la otra aparecer al instante, sin recargar la página.

### Matching por afinidad, no solo carrera/ciclo
Después de los datos básicos, el registro incluye 3 preguntas cortas
(estado de ánimo actual, tipo de apoyo que busca, mayor reto de equilibrio)
diseñadas para que el matching agrupe personas realmente compatibles, no
solo con la misma carrera. El criterio principal de agrupación es el
**tipo de apoyo buscado** (catarsis, consejos prácticos, pertenencia, o
desconexión) — si dos personas buscan cosas incompatibles dentro del
mismo grupo, el soporte entre pares tiende a generar más frustración que
alivio. Si no hay un grupo con ese match ideal, se hace fallback a
agrupar solo por carrera/ciclo.

### Sesión persistente
Si ya iniciaste sesión antes en el mismo navegador, la Landing te redirige
directo al dashboard en vez de pedirte el formulario de nuevo. Si cierras
sesión, entras desde otro dispositivo, o borras el navegador, se crea una
identidad anónima nueva (limitación conocida — el roadmap incluye
autenticación real con correo institucional para persistencia real entre
dispositivos).

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
