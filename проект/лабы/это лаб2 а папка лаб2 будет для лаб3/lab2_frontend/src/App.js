import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      const res = await axios.get('http://localhost:3000/clients');
      setClients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getServices = async () => {
    try {
      const res = await axios.get('http://localhost:3000/services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getRequests = async () => {
    try {
      const res = await axios.get('http://localhost:3000/requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Клиенты</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h1>Услуги</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.name}</td>
              <td>{service.price} руб.</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h1>Заявки</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID клиента</th>
            <th>ID услуги</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.client_id}</td>
              <td>{request.service_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;