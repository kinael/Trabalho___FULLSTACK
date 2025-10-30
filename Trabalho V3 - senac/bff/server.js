import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const BASE = process.env.BUSINESS_API || "http://localhost:4000";

async function call(path, init={}) {
  const res = await fetch(`${BASE}${path}`, { headers:{'Content-Type':'application/json'}, ...init });
  const data = await res.json().catch(()=> ({}));
  if (!res.ok) throw { status: res.status || 500, data };
  return data;
}

app.get("/health", async (_req,res)=>{
  try { const ping = await call("/health"); res.json({ ok:true, business: ping }); }
  catch { res.json({ ok:true, business: { ok:false } }); }
});

app.post("/app/auth/login", async (req,res)=>{
  try { res.json(await call("/auth/login", { method:"POST", body: JSON.stringify(req.body) })); }
  catch (e){ res.status(e.status||500).json(e.data); }
});
app.post("/app/auth/signup", async (req,res)=>{
  try { res.status(201).json(await call("/auth/signup", { method:"POST", body: JSON.stringify(req.body) })); }
  catch (e){ res.status(e.status||500).json(e.data); }
});

app.get("/app/availability", async (req,res)=>{
  const q = new URLSearchParams(req.query).toString();
  try { res.json(await call(`/availability?${q}`)); }
  catch (e){ res.status(e.status||500).json(e.data); }
});

app.post("/app/reservations", async (req,res)=>{
  try { res.status(201).json(await call("/reservations", { method:"POST", body: JSON.stringify(req.body) })); }
  catch (e){ res.status(e.status||500).json(e.data); }
});
app.get("/app/reservations/my", async (req,res)=>{
  const { userEmail } = req.query;
  try { res.json(await call(`/reservations?userEmail=${encodeURIComponent(userEmail)}`)); }
  catch (e){ res.status(e.status||500).json(e.data); }
});
app.delete("/app/reservations/:id", async (req,res)=>{
  try {
    const r = await fetch(`${BASE}/reservations/${req.params.id}`, { method: "DELETE" });
    if (!r.ok) return res.status(r.status).json(await r.json().catch(()=>({})));
    res.status(204).end();
  } catch { res.status(500).json({ error: "Falha ao cancelar" }); }
});

app.get("/app/reports/summary", async (_req,res)=>{
  try { res.json(await call("/reports/summary")); }
  catch (e){ res.status(e.status||500).json(e.data); }
});

app.get("/app/resources", async (_req,res)=>{
  try { res.json(await call("/resources")); }
  catch (e){ res.status(e.status||500).json(e.data); }
});
app.post("/app/resources/mesas", async (req,res)=>{
  try { res.status(201).json(await call("/resources/mesas", { method:"POST", body: JSON.stringify(req.body) })); }
  catch (e){ res.status(e.status||500).json(e.data); }
});
app.post("/app/resources/salas", async (req,res)=>{
  try { res.status(201).json(await call("/resources/salas", { method:"POST", body: JSON.stringify(req.body) })); }
  catch (e){ res.status(e.status||500).json(e.data); }
});
app.patch("/app/resources/:type/:id/toggle", async (req,res)=>{
  try { res.json(await call(`/resources/${req.params.type}/${req.params.id}/toggle`, { method:"PATCH" })); }
  catch (e){ res.status(e.status||500).json(e.data); }
});
app.delete("/app/resources/:type/:id", async (req,res)=>{
  try {
    const r = await fetch(`${BASE}/resources/${req.params.type}/${req.params.id}`, { method: "DELETE" });
    if (!r.ok) return res.status(r.status).json(await r.json().catch(()=>({})));
    res.status(204).end();
  } catch { res.status(500).json({ error: "Falha ao remover" }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>console.log(`BFF @${PORT} -> ${BASE}`));
print("teste")