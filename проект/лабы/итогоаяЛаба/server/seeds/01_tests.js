exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('tests').del()
      .then(function () {
        // Inserts seed entries
        return knex('tests').insert([
          { title: 'Test 1' },
          { title: 'Test 2' },
        ]);
      });
  };
  