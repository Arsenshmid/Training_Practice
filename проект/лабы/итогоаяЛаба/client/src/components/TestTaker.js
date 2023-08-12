import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestTaker({ testId }) {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axios.get(`/api/tests/${testId}`)
      .then(response => {
        setTest(response.data);
        setAnswers(new Array(response.data.questions.length).fill(null));
      })
      .catch(error => {
        console.error(error);
      });
  }, [testId]);

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answerIndex;
    setAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    if (!test) {
      return 0;
    }

    const totalQuestions = test.questions.length;
    let correctAnswers = 0;

    for (let i = 0; i < totalQuestions; i++) {
      const correctAnswerIndex = test.questions[i].answers.findIndex(answer => answer.is_correct);
      if (correctAnswerIndex === answers[i]) {
        correctAnswers++;
      }
    }

    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    return scorePercentage.toFixed(2);
  };

  if (!test) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Прохождение теста: {test.title}</h1>
      {test.questions.map((question, questionIndex) => (
        <div key={questionIndex}>
          <h3>Вопрос {questionIndex + 1}:</h3>
          <p>{question.question_text}</p>
          <ul>
            {question.answers.map((answer, answerIndex) => (
              <li key={answerIndex}>
                <label>
                  <input
                    type="radio"
                    checked={answers[questionIndex] === answerIndex}
                    onChange={() => handleAnswerChange(questionIndex, answerIndex)}
                  />
                  {answer.answer_text}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <button onClick={() => alert(`Ваш результат: ${calculateScore()}%`)}>Завершить тест</button>
      </div>
    </div>
  );
}

export default TestTaker;
