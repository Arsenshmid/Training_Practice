exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('questions').del()
      .then(function () {
        // Inserts seed entries
        return knex('questions').insert([
          { test_id: 1, question_text: 'Question 1 for Test 1' },
          { test_id: 1, question_text: 'Question 2 for Test 1' },
          { test_id: 2, question_text: 'Question 1 for Test 2' },
          { test_id: 2, question_text: 'Question 2 for Test 2' },
        ]);
      });
  };
  