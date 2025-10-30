const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const error = require('./middlewares/error');

const authRoutes = require('./routes/auth.routes');
const resourcesRoutes = require('./routes/resources.routes');
const availabilityRoutes = require('./routes/availability.routes');
const reservationsRoutes = require('./routes/reservations.routes');
const reportsRoutes = require('./routes/reports.routes'); // <- NOVO

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/app/auth', authRoutes);
app.use('/app/resources', resourcesRoutes);
app.use('/app/availability', availabilityRoutes);
app.use('/app/reservations', reservationsRoutes);
app.use('/app/reports', reportsRoutes); // <- NOVO

app.get('/app/health', (_req, res) => res.json({ ok: true }));

app.use(error);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`[BFF] rodando na porta ${PORT}`));
