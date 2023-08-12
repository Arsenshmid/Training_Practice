const express = require('express');
const { Client } = require('pg');
const knex = require('knex');
const { soap } = require('express-soap');

// Подключение к базе данных PostgreSQL
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1',
    database: 'arsenshmid'
  }
});

// Создание Express приложения
const app = express();

// Middleware для работы с SOAP
app.use(soap({
  services: {
    // SOAP-операция для получения всех клиентов
    GetClients: async () => {
      const clients = await db('clients').select('*');
      return { clients };
    },
    // SOAP-операция для получения всех услуг
    GetServices: async () => {
      const services = await db('services').select('*');
      return { services };
    },
    // SOAP-операция для получения всех заявок
    GetRequests: async () => {
      const requests = await db('requests').select('*');
      return { requests };
    },
  }
}));

// Запуск сервера
const port = 3001;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
