const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');

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

app.post('/api/tests', async (req, res) => {
  const { title, questions } = req.body;

  try {
    const [testId] = await db('tests').insert({ title }).returning('id');

    const formattedQuestions = questions.map(question => ({
      test_id: testId,
      text: question.text
    }));
    const [questionIds] = await db('questions').insert(formattedQuestions).returning('id');

    const formattedAnswers = [];
    questions.forEach((question, index) => {
      const answers = question.answers.map(answer => ({
        question_id: questionIds[index],
        text: answer.text,
        is_correct: answer.isCorrect
      }));
      formattedAnswers.push(...answers);
    });
    await db('answers').insert(formattedAnswers);

    return res.status(201).json({ message: 'Тест успешно создан.' });
  } catch (error) {
    console.error('Ошибка при создании теста:', error);
    return res.status(500).json({ error: 'Ошибка при создании теста.' });
  }
});

app.get('/api/tests', async (req, res) => {
  try {
    const tests = await db('tests').select('id', 'title');
    return res.status(200).json(tests);
  } catch (error) {
    console.error('Ошибка при получении тестов:', error);
    return res.status(500).json({ error: 'Ошибка при получении тестов.' });
  }
});

app.get('/api/tests/:testId', async (req, res) => {
  const { testId } = req.params;

  try {
    const test = await db('tests').where('id', testId).first();
    if (!test) {
      return res.status(404).json({ error: 'Тест не найден.' });
    }

    const questions = await db('questions').where('test_id', testId);
    const formattedQuestions = await Promise.all(questions.map(async question => {
      const answers = await db('answers').where('question_id', question.id);
      return { ...question, answers };
    }));

    return res.status(200).json({ test, questions: formattedQuestions });
  } catch (error) {
    console.error('Ошибка при получении теста:', error);
    return res.status(500).json({ error: 'Ошибка при получении теста.' });
  }
});

app.post('/api/tests/:testId/submit', async (req, res) => {
  const { testId } = req.params;
  const userAnswers = req.body;

  try {
    const questions = await db('questions').where('test_id', testId);
    let score = 0;

    questions.forEach((question, index) => {
      const correctAnswer = question.answers.find(answer => answer.is_correct);
      if (correctAnswer && correctAnswer.id === userAnswers[index].answerId) {
        score++;
      }
    });

    return res.status(200).json({ score, totalQuestions: questions.length });
  } catch (error) {
    console.error('Ошибка при отправке результатов теста:', error);
    return res.status(500).json({ error: 'Ошибка при отправке результатов теста.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}.`);
});
