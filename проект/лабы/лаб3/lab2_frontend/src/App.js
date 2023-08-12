import React, { useEffect, useState } from 'react';
import soapClient from './soapClient';

const App = () => {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      const url = 'http://localhost:3001/wsdl';
      const headers = {
        'Content-Type': 'text/xml;charset=UTF-8',
      };
      const xml = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://localhost:3001/wsdl">
          <soapenv:Header/>
          <soapenv:Body>
            <web:GetClients/>
          </soapenv:Body>
        </soapenv:Envelope>
      `;

      const body = await soapClient(url, headers, xml);
      const clientsArray = body.GetClientsResponse.clients.client.map((c) => c.name);
      setClients(clientsArray);
    };

    const fetchServices = async () => {
      // Аналогичный запрос для услуг
    };

    const fetchRequests = async () => {
      // Аналогичный запрос для заявок
    };

    fetchClients();
    fetchServices();
    fetchRequests();
  }, []);

  return (
    <div>
      <h1>Клиенты:</h1>
      <ul>
        {clients.map((client, index) => (
          <li key={index}>{client}</li>
        ))}
      </ul>
      {/* Аналогичный вывод для услуг и заявок */}
    </div>
  );
};

export default App;
