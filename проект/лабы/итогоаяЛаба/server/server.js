const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');

// Подключение к базе данных (используется PostgreSQL)
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1',
    database: 'arsenshmid'
  }
});

const app = express();
app.use(bodyParser.json());

// Получение списка тестов
app.get('/api/tests', (req, res) => {
  db.select('*').from('tests')
    .then(tests => {
      res.json(tests);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Ошибка при получении данных о тестах.' });
    });
});

// Получение теста по его ID
app.get('/api/tests/:test_id', (req, res) => {
  const test_id = req.params.test_id;

  db.select('*').from('questions').where('test_id', test_id)
    .then(questions => {
      res.json(questions);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Ошибка при получении данных о вопросах.' });
    });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}.`);
});
