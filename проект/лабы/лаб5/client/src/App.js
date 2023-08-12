import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientList from './components/ClientList';

function App() {
  const [newClientName, setNewClientName] = useState('');
  const [clients, setClients] = useState([]);
  const [mockData, setMockData] = useState(null);
  const [modifiedMockData, setModifiedMockData] = useState(null);

  const handleAddClient = () => {
    if (newClientName.trim() === '') return;
    axios.post('/api/clients', { name: newClientName })
      .then((response) => {
        setClients([...clients, response.data]);
        setNewClientName('');
      })
      .catch((error) => console.error('Error adding client', error));
  };

  const handleGetClients = () => {
    axios.get('/api/clients')
      .then((response) => setClients(response.data))
      .catch((error) => console.error('Error fetching clients', error));
  };

  const handleGetMockData = () => {
    axios.get('http://www.mocky.io/v2/5c7db5e13100005a00375fda')
      .then((response) => {
        setMockData(response.data);
        const modifiedData = response.data.replace(/ /g, '_');
        setModifiedMockData(modifiedData);
      })
      .catch((error) => console.error('Error fetching mock data', error));
  };

  useEffect(() => {
    handleGetClients();
  }, []);

  return (
    <div className="App">
      <h1>Client List</h1>
      <ClientList clients={clients} />
      {mockData && (
        <div>
          <h2>Mock Data</h2>
          <p>{JSON.stringify(mockData)}</p>
          <h2>Modified Mock Data</h2>
          <p>{JSON.stringify(modifiedMockData)}</p>
        </div>
      )}
      <div>
        <input
          type="text"
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
        />
        <button onClick={handleAddClient}>Add Client</button>
        <button onClick={handleGetClients}>Get Clients</button>
        <button onClick={handleGetMockData}>Get Mock Data</button>
      </div>
    </div>
  );
}

export default App;
