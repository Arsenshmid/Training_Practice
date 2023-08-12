import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', answers: [{ text: '', isCorrect: false }] }]);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    axios.get('/api/tests')
      .then(response => {
        setAvailableTests(response.data);
      })
      .catch(error => {
        console.error('Error fetching available tests:', error);
      });
  }, []);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', answers: [{ text: '', isCorrect: false }] }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleAddAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push({ text: '', isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleCheckboxChange = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.map((answer, index) => ({
      ...answer,
      isCorrect: index === answerIndex,
    }));
    setQuestions(updatedQuestions);
  };

  const handleSaveTest = () => {
    if (!title || !questions.some(q => q.text)) {
      alert('Заполните все поля перед сохранением теста.');
      return;
    }

    const data = { title, questions };
    axios.post('/api/tests', data)
      .then(response => {
        alert(response.data.message);
        setTitle('');
        setQuestions([{ text: '', answers: [{ text: '', isCorrect: false }] }]);
      })
      .catch(error => {
        alert(error.response.data.error);
      });
  };

  const handleSubmitTest = (testId) => {
    const formattedAnswers = userAnswers.map(answer => ({
      answerId: answer.answerId,
      isCorrect: answer.isCorrect
    }));

    axios.post(`/api/tests/${testId}/submit`, formattedAnswers)
      .then(response => {
        alert(`Ваш результат: ${response.data.score}/${response.data.totalQuestions}`);
        setSelectedTest(null);
        setUserAnswers([]);
      })
      .catch(error => {
        console.error('Ошибка при отправке теста:', error);
      });
  };

  const handleStartTest = (test) => {
    axios.get(`/api/tests/${test.id}`)
      .then(response => {
        setSelectedTest(response.data.test);
        setUserAnswers(Array(response.data.questions.length).fill({ answerId: null, isCorrect: false }));
      })
      .catch(error => {
        console.error('Ошибка при получении теста:', error);
      });
  };

  const handleCancelTest = () => {
    setSelectedTest(null);
    setUserAnswers([]);
  };

  const handleUserAnswer = (questionIndex, answerId, isCorrect) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[questionIndex] = { answerId, isCorrect };
    setUserAnswers(updatedUserAnswers);
  };

  const handleOpenExitModal = () => {
    setIsExitModalOpen(true);
  };

  const handleCloseExitModal = () => {
    setIsExitModalOpen(false);
  };

  return (
    <div>
      <h1>Система тестирования</h1>
      <div>
        <label>Название теста:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        {questions.map((question, index) => (
          <div key={index}>
            <label>Вопрос {index + 1}:</label>
            <input
              type="text"
              value={question.text}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].text = e.target.value;
                setQuestions(updatedQuestions);
              }}
            />
            {question.answers.map((answer, ansIndex) => (
              <div key={ansIndex}>
                <input
                  type="text"
                  value={answer.text}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].answers[ansIndex].text = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                />
                <input
                  type="checkbox"
                  checked={answer.isCorrect}
                  onChange={() => handleCheckboxChange(index, ansIndex)}
                />
                {ansIndex === question.answers.length - 1 && (
                  <button onClick={() => handleAddAnswer(index)}>Добавить ответ</button>
                )}
                {ansIndex > 1 && (
                  <button onClick={() => handleRemoveAnswer(index, ansIndex)}>Удалить ответ</button>
                )}
              </div>
            ))}
            <button onClick={handleAddQuestion}>Добавить вопрос</button>
            {index > 0 && (
              <button onClick={() => handleRemoveQuestion(index)}>Удалить вопрос</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleOpenExitModal}>Выйти</button>
      {isExitModalOpen && (
        <div>
          <p>Вы хотите сохранить тест перед выходом?</p>
          <button onClick={handleSaveTest}>Сохранить</button>
          <button onClick={handleCloseExitModal}>Не сохранять</button>
        </div>
      )}
      <button onClick={handleSaveTest}>Сохранить</button>
      {availableTests.length > 0 && (
        <div>
          <h2>Доступные тесты</h2>
          <ul>
            {availableTests.map(test => (
              <li key={test.id}>
                {test.title}{' '}
                <button onClick={() => handleStartTest(test)}>Начать</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedTest && (
        <div>
          <h2>Прохождение теста - {selectedTest.title}</h2>
          {selectedTest.questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <p>{question.text}</p>
              <ul>
                {question.answers.map((answer, ansIndex) => (
                  <li key={ansIndex}>
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={answer.text}
                      checked={userAnswers[questionIndex].answerId === answer.id}
                      onChange={() => handleUserAnswer(questionIndex, answer.id, answer.is_correct)}
                    />
                    {answer.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={() => handleSubmitTest(selectedTest.id)}>Завершить тест</button>
          <button onClick={handleCancelTest}>Отмена</button>
        </div>
      )}
    </div>
  );
}

export default App;
