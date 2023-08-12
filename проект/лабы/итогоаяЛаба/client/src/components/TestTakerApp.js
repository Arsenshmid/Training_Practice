import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TestTaker from './TestTaker';
import TestSelector from './TestSelector';

function TestTakerApp() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    axios.get('/api/tests')
      .then(response => {
        setTests(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSelectTest = (selectedTest) => {
    setSelectedTest(selectedTest);
  };

  return (
    <div>
      <h1>Система тестирования</h1>
      {selectedTest ? (
        <TestTaker testId={selectedTest.id} />
      ) : (
        <TestSelector tests={tests} onSelectTest={handleSelectTest} />
      )}
    </div>
  );
}

export default TestTakerApp;
