import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const App = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3000/wsdl',
          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.example.com/wsdl"><soapenv:Header/><soapenv:Body><web:getClients/></soapenv:Body></soapenv:Envelope>',
          { headers: { 'Content-Type': 'text/xml' } }
        );
        const result = await parseStringPromise(response.data);
        const clients = result['soap:Envelope']['soap:Body'][0].getClientsResponse[0].clients[0].client.map(
          (client) => ({
            id: client.id[0],
            name: client.name[0],
          })
        );
        setClients(clients);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClients();
  }, []);

  return (
    <div>
      <h1>Client list</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;