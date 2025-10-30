const API = "http://localhost:3001/app"; 

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts
  });
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data ?? {};
}

const LS_KEYS = { session: "rs_session" };
const saveSession = (user) => localStorage.setItem(LS_KEYS.session, JSON.stringify(user));
const loadSession = () => { try { return JSON.parse(localStorage.getItem(LS_KEYS.session) || "null"); } catch { return null; } };
const clearSession = () => localStorage.removeItem(LS_KEYS.session);

const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
