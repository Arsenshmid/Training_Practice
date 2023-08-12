const soap = require('soap');
const db = require('./createDatabase'); // Замените './createDatabase' на правильный путь к файлу createDatabase.js

const fs = require('fs');

const service = {
  DataService: {
    DataServiceSoap: {
      // Чтение данных
      getClients: async function (args) {
        try {
          const clients = await db('clients').select('*');
          return { clients: clients };
        } catch (error) {
          return { error: 'Error retrieving clients from the database.' };
        }
      },
      // Остальные методы чтения/добавления/изменения/удаления данных здесь
    },
  },
};

// Прочитайте XML-файл с описанием службы
const xml = fs.readFileSync(__dirname + '/dataService.wsdl', 'utf8');

// Создайте объект WSDL с использованием XML-файла
const wsdlOptions = {
  xml: xml,
  endpoint: '/soap', // Путь, на котором слушает SOAP-сервер
};
const wsdl = soap.WSDL(wsdlOptions);

// Запустите сервер SOAP
soap.listen(
  {
    path: '/soap',
    services: service,
    xml: xml,
  },
  () => {
    console.log('SOAP server running on http://localhost:8000/soap');
  }
);
