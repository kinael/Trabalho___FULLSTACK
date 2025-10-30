const BASE = process.env.BUSINESS_API || 'http://localhost:4000';

async function call(method, path, body) {
  const url = `${BASE}${path}`;
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  let data = {};
  try { data = await res.json(); } catch (e) { /* vazio ou não-json */ }

  if (!res.ok) {
    const err = new Error(data?.message || `Erro Business API (${res.status})`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

module.exports = { call };
