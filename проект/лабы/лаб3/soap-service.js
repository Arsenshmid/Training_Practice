const soap = require('soap');
const db = require('./db');

const url = 'http://localhost:8000/wsdl?wsdl';

const service = {
  Lab3Service: {
    Lab3Port: {
      // Операция для чтения клиентов
      getClients: async function (args) {
        try {
          const clients = await db('clients').select('*');
          return { clients: clients };
        } catch (error) {
          console.error(error);
          return { error: 'Internal Server Error' };
        }
      },

      // Операция для добавления клиента
      addClient: async function (args) {
        const { name } = args;
        if (!name) {
          return { error: 'Name is required' };
        }

        try {
          const newClient = await db('clients').insert({ name }, '*');
          return { client: newClient[0] };
        } catch (error) {
          console.error(error);
          return { error: 'Internal Server Error' };
        }
      },

      // Операция для чтения услуг
      getServices: async function (args) {
        try {
          const services = await db('services').select('*');
          return { services: services };
        } catch (error) {
          console.error(error);
          return { error: 'Internal Server Error' };
        }
      },

      // Операция для добавления услуги
      addService: async function (args) {
        const { name, price } = args;
        if (!name || !price) {
          return { error: 'Name and price are required' };
        }

        try {
          const newService = await db('services').insert({ name, price }, '*');
          return { service: newService[0] };
        } catch (error) {
          console.error(error);
          return { error: 'Internal Server Error' };
        }
      },

      // Операция для чтения заявок
      getRequests: async function (args) {
        try {
          const requests = await db('requests').select('*');
          return { requests: requests };
        } catch (error) {
          console.error(error);
          return { error: 'Internal Server Error' };
        }
      },

      // Операция для добавления заявки
      addRequest: async function (args) {
        const { client_id, service_id } = args;
        if (!client_id || !service_id) {
          return { error: 'Client ID and service ID are required' };
        }

        try {
          const newRequest = await db('requests').insert({ client_id, service_id }, '*');
          return { request: newRequest[0] };
        } catch (error) {
          console.error(error);
          return { error: 'Internal Server Error' };
        }
      },
    },
  },
};

const xml = require('fs').readFileSync('lab3.wsdl', 'utf8');

const server = soap.listen(require('http').createServer(function (request, response) {
  response.end('404: Not Found: ' + request.url);
}), '/wsdl', service, xml);

server.log = function (type, data) {
  console.log(type);
  console.log(data);
};
