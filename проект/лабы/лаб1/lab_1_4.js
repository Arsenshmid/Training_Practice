const express = require('express');
const app = express();

// Обработчик GET-запроса для получения числа Фибоначчи по индексу
app.get('/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const fibonacciNumber = getFibonacciNumber(index);
  
  // Отправляем результат в виде JSON
  res.json({ fibonacciNumber });

  // Сохраняем результат в файл
  const data = JSON.stringify({ url: req.originalUrl, response: { fibonacciNumber }, method: 'GET' }, null, 2);
  fs.writeFile('lab_2.json', data, (err) => {
    if (err) {
      console.error('Ошибка при сохранении файла:', err);
    } else {
      console.log('Файл сохранен');
    }
  });
});

// Функция для получения числа Фибоначчи по индексу
function getFibonacciNumber(index) {
  if (index < 0) {
    return NaN;
  } else if (index === 0) {
    return 0;
  } else if (index === 1) {
    return 1;
  } else {
    let a = 0;
    let b = 1;
    let c;
    for (let i = 2; i <= index; i++) {
      c = a + b;
      a = b;
      b = c;
    }
    return c;
  }
}

// Запуск сервера на порту 3001
app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});