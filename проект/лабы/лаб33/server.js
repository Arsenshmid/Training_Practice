const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');

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

app.use(cors());
app.use(bodyParser.raw({ type: function () { return true; }, limit: '5mb' }));

// Сервирование статических файлов из директории "public"
app.use(express.static('public'));

// Определение SOAP-сервиса
const service = require('./service');

// Определение содержимого файла WSDL
const xml = require('fs').readFileSync('./service.wsdl', 'utf8');

// Создание SOAP-сервера
soap.listen(app, '/soap', service, xml, function () {
  console.log('SOAP-сервер работает по адресу http://localhost:3000/soap');
});

app.listen(3000, () => {
  console.log('Сервер работает по адресу http://localhost:3000');
});
