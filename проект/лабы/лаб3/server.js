const express = require('express');
const bodyParser = require('body-parser');
const soap = require('soap');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// API для чтения клиентов
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await db('clients').select('*');
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API для добавления клиента
app.post('/api/clients', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const newClient = await db('clients').insert({ name }, '*');
    res.json(newClient[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API для чтения услуг
app.get('/api/services', async (req, res) => {
  try {
    const services = await db('services').select('*');
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API для добавления услуги
app.post('/api/services', async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  try {
    const newService = await db('services').insert({ name, price }, '*');
    res.json(newService[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API для чтения заявок
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await db('requests').select('*');
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API для добавления заявки
app.post('/api/requests', async (req, res) => {
  const { client_id, service_id } = req.body;
  if (!client_id || !service_id) {
    return res.status(400).json({ error: 'Client ID and service ID are required' });
  }

  try {
    const newRequest = await db('requests').insert({ client_id, service_id }, '*');
    res.json(newRequest[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
