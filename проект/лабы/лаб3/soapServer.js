const express = require('express');
const bodyParser = require('body-parser');
const { soap } = require('strong-soap');

const app = express();
app.use(bodyParser.raw({ type: () => true }));

const myService = {
  MyService: {
    MyServicePort: {
      GetClients: (args, callback) => {
        // Your logic to fetch clients from the database and return the result
        callback({
          clients: [], // Replace with the actual result from the database
        });
      },
      // Add other operations for services and requests
    },
  },
};

const server = soap.listen(app, '/wsdl', myService);

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});
