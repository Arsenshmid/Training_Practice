// Получить список клиентов
app.get('/clients', async (req, res) => {
    try {
      const clients = await db.select('*').from('clients');
      res.json(clients);
    } catch (err) {
      res.status(500).json({ error: 'Ошибка на сервере' });
    }
  });
  
  // Добавить нового клиента
  app.post('/clients', async (req, res) => {
    try {
      const { name } = req.body;
      const [id] = await db('clients').insert({ name }).returning('id');
      res.json({ id, name });
    } catch (err) {
      res.status(500).json({ error: 'Ошибка на сервере' });
    }
  });
  
  // Обновить клиента
  app.put('/clients/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await db('clients').where({ id }).update({ name });
      res.json({ id, name });
    } catch (err) {
      res.status(500).json({ error: 'Ошибка на сервере' });
    }
  });
  
  // Удалить клиента
  app.delete('/clients/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db('clients').where({ id }).del();
      res.json({id });
    } catch (err) {
      res.status(500).json({ error: 'Ошибка на сервере' });
    }
  });
  
  // Аналогичные маршруты для "services" и "requests"
  
  // Запустите сервер с помощью команды: `node server.js`