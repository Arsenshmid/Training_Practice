const soap = require('strong-soap').soap;

const url = 'http://localhost:3000/soap?wsdl';


const requestArgs = {}; // Нет аргументов для этого метода

soap.createClient(url, function (err, client) {
  if (err) {
    console.error('Error creating SOAP client:', err);
    return;
  }

  client.getDataServiceSoap.getClients(requestArgs, function (err, result) {
    if (err) {
      console.error('Error calling getClients:', err);
      return;
    }

    const clients = result.clients;
    console.log('Clients:', clients);
  });
});
