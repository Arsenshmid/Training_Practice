const express = require('express');
const knex = require('knex');

const app = express();
const port = 3001;

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1',
    database: 'lab2_db'
  }
});

app.use(express.json());

app.get('/api/clients', async (req, res) => {
  try {
    const clients = await db.select().from('clients');
    res.json(clients);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/clients', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const newClient = await db('clients').insert({ name }).returning('*');
    res.status(201).json(newClient[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
