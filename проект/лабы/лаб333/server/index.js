const express = require('express');
const app = express();
const soap = require('soap');
const bodyParser = require('body-parser');
const db = require('../createDatabase');

app.use(bodyParser.json());

// API для чтения данных

app.get('/clients', async (req, res) => {
  try {
    const clients = await db('clients').select('*');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving clients from the database.' });
  }
});

app.get('/services', async (req, res) => {
  try {
    const services = await db('services').select('*');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving services from the database.' });
  }
});

app.get('/requests', async (req, res) => {
  try {
    const requests = await db('requests').select('*');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving requests from the database.' });
  }
});

// API для добавления данных

app.post('/clients', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Client name is required.' });
  }

  try {
    const client = await db('clients').insert({ name }).returning('*');
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error adding client to the database.' });
  }
});

app.post('/services', async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Service name and price are required.' });
  }

  try {
    const service = await db('services').insert({ name, price }).returning('*');
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error adding service to the database.' });
  }
});

app.post('/requests', async (req, res) => {
  const { client_id, service_id } = req.body;
  if (!client_id || !service_id) {
    return res.status(400).json({ error: 'Client ID and Service ID are required.' });
  }

  try {
    const request = await db('requests').insert({ client_id, service_id }).returning('*');
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Error adding request to the database.' });
  }
});

// API для изменения данных

app.put('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Client name is required.' });
  }

  try {
    const client = await db('clients').where({ id }).update({ name }).returning('*');
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error updating client in the database.' });
  }
});

app.put('/services/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Service name and price are required.' });
  }

  try {
    const service = await db('services').where({ id }).update({ name, price }).returning('*');
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error updating service in the database.' });
  }
});

// API для удаления данных

app.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db('clients').where({ id }).del();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting client from the database.' });
  }
});

app.delete('/services/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db('services').where({ id }).del();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting service from the database.' });
  }
});

app.delete('/requests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db('requests').where({ id }).del();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting request from the database.' });
  }
});

// Запуск сервера

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
