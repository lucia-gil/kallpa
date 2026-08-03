const KEY = "kallpa_user";

export function getSession() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function login({ name, carrera, ciclo }) {
  const user = {
    id: "demo-" + Date.now(),
    name,
    initials: name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
    carrera,
    ciclo,
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(KEY);
}
