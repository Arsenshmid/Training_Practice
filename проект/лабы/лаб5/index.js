const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'arsenshmid',
  password: '1',
  port: 5432,
});

// API для получения данных "Клиент"
app.get('/api/clients', (req, res) => {
  pool.query('SELECT * FROM clients', (error, result) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.send(result.rows);
    }
  });
});

// API для получения данных "Услуга"
app.get('/api/services', (req, res) => {
  pool.query('SELECT * FROM services', (error, result) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.send(result.rows);
    }
  });
});

// API для получения данных "Заявка"
app.get('/api/orders', async (req, res) => {
  try {
    // Выполнение SQL-запроса для получения данных "Заявка" из базы данных
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM requests JOIN clients ON requests.client_id = clients.id JOIN services ON requests.service_id = services.id'); // Здесь предполагается, что у вас есть таблицы с именами "requests", "clients" и "services" для хранения данных "Заявки", "Клиент" и "Услуга"
    const ordersData = result.rows; // Полученные данные

    client.release(); // Важно освободить соединение с базой данных после выполнения запроса

    res.json(ordersData); // Вернуть данные "Заявки" в качестве ответа на запрос
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Произошла ошибка при получении данных "Заявки".' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
