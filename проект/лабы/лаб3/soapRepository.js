const soap = require('soap');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const { Client, Server, Entity } = require('./soapRepository');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'arsenshmid',
  password: '1',
  port: 5432,
});

class Repository {
  async read(id) {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const values = [id];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  async create(entity) {
    const query = 'INSERT INTO clients(name) VALUES($1) RETURNING id';
    const values = [entity.name];
    const res = await pool.query(query, values);
    return res.rows[0].id;
  }

  async update(entity) {
    const query = 'UPDATE clients SET name = $1 WHERE id = $2';
    const values = [entity.name, entity.id];
    const res = await pool.query(query, values);
    return res.rowCount === 1;
  }

  async delete(id) {
    const query = 'DELETE FROM clients WHERE id = $1';
    const values = [id];
    const res = await pool.query(query, values);
    return res.rowCount === 1;
  }
}

const repository = new Repository();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(xmlparser());

const wsdl = `<definitions ... </definitions>`;
const service = {
  LabService: {
    LabServiceSoapPort: {
      read(args, callback) {
        const id = args.id;
        repository.read(id)
          .then((entity) => {
            if (entity) {
              callback(null, { Result: entity });
            } else {
              callback('Entity not found');
            }
          })
          .catch((err) => {
            callback(err);
          });
      },
      create(args, callback) {
        const entity = args.Entity;
        repository.create(entity)
          .then((id) => {
            callback(null, { Result: id });
          })
          .catch((err) => {
            callback(err);
          });
      },
      update(args, callback) {
        const entity = args.Entity;
        repository.update(entity)
          .then((result) => {
            if (result) {
              callback(null, { Result: true });
            } else {
              callback('Entity not found');
            }
          })
          .catch((err) => {
            callback(err);
          });
      },
      delete(args, callback) {
        const id = args.id;
        repository.delete(id)
          .then((result) => {
            if (result) {
              callback(null, { Result: true });
            } else {
              callback('Entity not found');
            }
          })
          .catch((err) => {
            callback(err);
          });
      },
    },
  },
};

const server = soap.listen(app, '/wsdl', service, wsdl);

app.listen(8000, () => {
  console.log('Listening on port 8000');
});
