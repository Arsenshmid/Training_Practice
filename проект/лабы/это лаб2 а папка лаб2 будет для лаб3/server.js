const express = require('express');
const cors = require('cors');
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1',
    database: 'lab2_db'
  }
});
const app = express();
app.use(cors());
app.use(express.json());

app.get('/clients', async (req, res) => {
  try {
    const clients = await db.select('*').from('clients');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка на сервере' });
  }
});

app.get('/services', async (req, res) => {
  try {
    const services = await db.select('*').from('services');
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка на сервере' });
  }
});

app.get('/requests', async (req, res) => {
  try {
    const requests = await db.select('*').from('requests');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка на сервере' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});