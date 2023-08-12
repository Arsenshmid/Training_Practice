const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const { soap } = require('strong-soap');

const app = express();
app.use(bodyParser.raw({ type: () => true }));

const databaseConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1',
  database: 'arsenshmid',
};

// Код для операций SOAP

const getClients = async () => {
  const client = new Client(databaseConfig);
  await client.connect();
  const result = await client.query('SELECT * FROM clients');
  await client.end();
  return result.rows;
};

const addClient = async (name) => {
  const client = new Client(databaseConfig);
  await client.connect();
  const result = await client.query('INSERT INTO clients (name) VALUES ($1) RETURNING id', [name]);
  await client.end();
  return result.rows[0].id;
};

const services = {
  MyService: {
    MyPort: {
      getClients: async (args, cb, headers, req) => {
        try {
          const clients = await getClients();
          return { clients };
        } catch (error) {
          console.error(error);
        }
      },
      addClient: async (args, cb, headers, req) => {
        try {
          const id = await addClient(args.name);
          return { id };
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
};

const xml = require('fs').readFileSync('./service.wsdl', 'utf8');
const server = soap.listen(app, '/wsdl', services, xml);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
