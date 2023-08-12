const express = require('express'); // Подключаем модуль Express для создания сервера

const app = express(); // Создаем экземпляр сервера
 
app.get('/:number', (req, res) => {
  const { number } = req.params; // Извлекаем значение параметра number из запроса

  const numToWords = require('number-to-words'); // Подключаем модуль number-to-words для преобразования числа в слова

  const result = numToWords.toWords(number); // Преобразуем число в слова

  res.json({ result }); // Отправляем JSON-ответ с преобразованными словами
});
 
app.listen(3000, () => {
  console.log('Server started on port 3000'); // Выводим сообщение в консоль о том, что сервер запущен
});
