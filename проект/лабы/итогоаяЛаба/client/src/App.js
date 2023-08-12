import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TestTaker from './TestTaker';
import TestSelector from './TestSelector';

function App() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', answers: [{ text: '', isCorrect: false }] }]);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

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

  const handleSaveTestAndExit = () => {
    handleSaveTest();
    handleCloseExitModal();
  };

  const handleOpenExitModal = () => {
    setIsExitModalOpen(true);
  };

  const handleCloseExitModal = () => {
    setIsExitModalOpen(false);
  };

  useEffect(() => {
    axios.get('/api/tests')
      .then(response => {
        setTests(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSelectTest = (selectedTest) => {
    setSelectedTest(selectedTest);
  };

  return (
    <div>
      <h1>Система тестирования</h1>
      {selectedTest ? (
        <TestTaker test={selectedTest} />
      ) : (
        <div>
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
              <button onClick={handleSaveTestAndExit}>Сохранить</button>
              <button onClick={handleCloseExitModal}>Не сохранять</button>
            </div>
          )}
          <button onClick={handleSaveTest}>Сохранить</button>
          <TestSelector tests={tests} onSelectTest={handleSelectTest} />
        </div>
      )}
    </div>
  );
}

export default App;
