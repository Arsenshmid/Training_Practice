const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'arsenshmid',
  password: '1',
  port: 5432,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/clients', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM clients');
  res.send(rows);
});

app.post('/api/clients', async (req, res) => {
  const { name } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO clients (name) VALUES ($1) RETURNING *',
    [name]
  );
  res.send(rows[0]);
});

app.get('/api/services', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM services');
  res.send(rows);
});

app.post('/api/services', async (req, res) => {
  const { name, price } =req.body;
  const { rows } = await pool.query(
    'INSERT INTO services (name, price) VALUES ($1, $2) RETURNING *',
    [name, price]
  );
  res.send(rows[0]);
});

app.get('/api/requests', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT requests.id, clients.name AS client_name, services.name AS service_name, services.price FROM requests INNER JOIN clients ON requests.client_id = clients.id INNER JOIN services ON requests.service_id = services.id'
  );
  res.send(rows);
});

app.post('/api/requests', async (req, res) => {
  const { client_id, service_id } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO requests (client_id, service_id) VALUES ($1, $2) RETURNING *',
    [client_id, service_id]
  );
  res.send(rows[0]);
});

app.listen(5000, () => {
  console.log('Server has started on port 5000');
});