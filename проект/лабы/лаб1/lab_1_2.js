const express = require('express');
const app = express();
const fs = require('fs');

// Обработчик GET-запроса для решения уравнения
app.get('/', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  const c = parseFloat(req.query.c);

  // Решение уравнения
  const discriminant = b * b - 4 * a * c;
  let result;

  if (discriminant > 0) {
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    result = { x1, x2 };
  } else if (discriminant === 0) {
    const x = -b / (2 * a);
    result = { x };
  } else {
    result = 'No real roots';
  }

  // Отправляем результат в виде JSON
  res.json(result);

  // Сохраняем результат в файл
  const data = JSON.stringify({ url: req.originalUrl, response: result, method: 'GET' }, null, 2);
  fs.writeFile('lab_1.json', data, (err) => {
    if (err) {
      console.error('Ошибка при сохранении файла:', err);
    } else {
      console.log('Файл сохранен');
    }
  });
});

// Запуск сервера на порту 3001
app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});