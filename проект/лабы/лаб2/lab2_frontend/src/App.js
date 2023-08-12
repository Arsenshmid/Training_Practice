import React, { useState, useEffect } from 'react';
import { soap } from 'soap';

import React from 'react';

function App() {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getClients();
    getServices();
    getRequests();
  }, []);

  const getClients = async () => {
    try {
      const client = await soap.createClientAsync(
        'http://localhost:3000/lab2?wsdl'
      );
      const result = await client.getClientsAsync({});
      setClients(result[0].clients);
    } catch (err) {
      console.error(err);
    }
  };

  // Добавьте аналогичные функции для остальных операций (CRUD) и сущностей (services, requests)

  // Ваш код для отображения данных останется прежним
}

export default App;