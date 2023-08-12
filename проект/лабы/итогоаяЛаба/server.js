const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');

// Подключение к базе данных (используется PostgreSQL)
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1',
    database: 'arsenshmid'
  }
});

const app = express();
app.use(bodyParser.json());

// Получение списка тестов
app.get('/api/tests', (req, res) => {
  db.select('*').from('tests')
    .then(tests => {
      res.json(tests);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Ошибка при получении данных о тестах.' });
    });
});

// Создаем тест
app.post('/api/tests', (req, res) => {
  const { title, questions } = req.body;

  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Некорректные данные для создания теста.' });
  }

  // Сохранение теста и вопросов в базу данных
  db.transaction(trx => {
    return db('tests')
      .insert({ title })
      .returning('id')
      .then(testId => {
        const questionsData = questions.map(question => ({
          test_id: testId[0],
          question_text: question.text
        }));

        return trx('questions')
          .insert(questionsData)
          .returning('id')
          .then(questionIds => {
            const answersData = questions.reduce((acc, question, index) => {
              question.answers.forEach((answer, ansIndex) => {
                acc.push({
                  question_id: questionIds[index],
                  answer_text: answer.text,
                  is_correct: answer.isCorrect
                });
              });
              return acc;
            }, []);

            return trx('answers').insert(answersData);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
  .then(() => {
    return res.status(201).json({ message: 'Тест успешно создан.' });
  })
  .catch(error => {
    return res.status(500).json({ error: 'Ошибка при создании теста.' });
  });
});

// Здесь можно добавить другие роуты и логику работы с БД

const PORT = 5000; // Вы можете использовать любой свободный порт на вашем компьютере

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}.`);
});
