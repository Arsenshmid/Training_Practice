const soap = require('soap');

const url = 'http://localhost:8000/wsdl?wsdl';

// Создание клиента SOAP
soap.createClient(url, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }

  // Выполнение операции для получения списка клиентов
  client.getClients({}, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    const clients = result.clients;
    console.log('Список клиентов:');
    console.log(clients);
  });
});
