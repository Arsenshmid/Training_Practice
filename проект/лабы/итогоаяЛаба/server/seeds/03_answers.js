exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('answers').del()
      .then(function () {
        // Inserts seed entries
        return knex('answers').insert([
          { question_id: 1, answer_text: 'Answer 1 for Question 1 Test 1', is_correct: true },
          { question_id: 1, answer_text: 'Answer 2 for Question 1 Test 1', is_correct: false },
          { question_id: 1, answer_text: 'Answer 3 for Question 1 Test 1', is_correct: false },
          { question_id: 2, answer_text: 'Answer 1 for Question 2 Test 1', is_correct: false },
          { question_id: 2, answer_text: 'Answer 2 for Question 2 Test 1', is_correct: true },
          { question_id: 2, answer_text: 'Answer 3 for Question 2 Test 1', is_correct: false },
          { question_id: 3, answer_text: 'Answer 1 for Question 1 Test 2', is_correct: false },
          { question_id: 3, answer_text: 'Answer 2 for Question 1 Test 2', is_correct: false },
          { question_id: 3, answer_text: 'Answer 3 for Question 1 Test 2', is_correct: true },
          { question_id: 4, answer_text: 'Answer 1 for Question 2 Test 2', is_correct: true },
          { question_id: 4, answer_text: 'Answer 2 for Question 2 Test 2', is_correct: false },
          { question_id: 4, answer_text: 'Answer 3 for Question 2 Test 2', is_correct: false },
        ]);
      });
  };
  