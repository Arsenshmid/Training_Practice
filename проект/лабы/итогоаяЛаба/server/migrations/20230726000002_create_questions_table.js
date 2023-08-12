exports.up = function (knex) {
    return knex.schema.createTable('questions', (table) => {
      table.increments('id').primary();
      table.integer('test_id').notNullable().references('id').inTable('tests').onDelete('CASCADE');
      table.text('question_text').notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('questions');
  };
  