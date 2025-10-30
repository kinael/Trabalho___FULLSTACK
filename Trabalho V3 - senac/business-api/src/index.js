const express = require('express');
const cors = require('cors');
const error = require('./middlewares/error');

require('./db/db');

const authRoutes = require('./routes/auth.routes');
const resourcesRoutes = require('./routes/resources.routes');
const availabilityRoutes = require('./routes/availability.routes');
const reservationsRoutes = require('./routes/reservations.routes');
const reportsRoutes = require('./routes/reports.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/resources', resourcesRoutes);
app.use('/availability', availabilityRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/reports', reportsRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(error);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`[BusinessAPI] porta ${PORT}`));
