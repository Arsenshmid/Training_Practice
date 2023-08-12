const express = require('express');
const app = express();

// Обработчик GET-запроса для получения дня недели по заданной дате
app.get('/', (req, res) => {
  const date = req.query.date;
  const dayOfWeek = getDayOfWeek(date);
  
  // Отправляем результат в виде JSON
  res.json({ dayOfWeek });

  // Сохраняем результат в файл
  const data = JSON.stringify({ url: req.originalUrl, response: { dayOfWeek }, method: 'GET' }, null, 2);
  fs.writeFile('lab_1.json', data, (err) => {
    if (err) {
      console.error('Ошибка при сохранении файла:', err);
    } else {
      console.log('Файл сохранен');
    }
  });
});

// Функция для получения дня недели по заданной дате
function getDayOfWeek(dateStr) {
  const date = new Date(dateStr);
  const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return daysOfWeek[date.getDay()];
}

// Запуск сервера на порту 3001
app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});