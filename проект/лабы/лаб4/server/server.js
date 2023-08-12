const express = require('express');
const axios = require('axios');

const app = express();
const port = 5000;

// Middleware для разрешения CORS (если клиент и сервер работают на разных доменах)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Роут для обработки запроса от клиента
app.get('/api/data', async (req, res) => {
  try {
    const url = 'http://www.mocky.io/v2/5c7db5e13100005a00375fda';
    const response = await axios.get(url);
    const modifiedData = {};

    // Заменяем пробелы на нижнее подчёркивание в данных из внешнего API
    for (const key in response.data) {
      modifiedData[key] = response.data[key].replace(/ /g, '_');
    }

    res.json(modifiedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from external API.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
