import React from 'react';

function TestSelector({ tests, onSelectTest }) {
  return (
    <div>
      <h2>Выберите тест:</h2>
      <ul>
        {tests.map(test => (
          <li key={test.id}>
            <button onClick={() => onSelectTest(test)}>{test.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestSelector;
