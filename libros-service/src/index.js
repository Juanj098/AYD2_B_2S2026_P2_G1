require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { init } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/libros', require('./routes/libros.routes'));

const PORT = process.env.PORT || 3001;
init()
  .then(() => app.listen(PORT, () => console.log(`libros-service en puerto ${PORT}`)))
  .catch((err) => { console.error('Error al conectar la BD', err); process.exit(1); });