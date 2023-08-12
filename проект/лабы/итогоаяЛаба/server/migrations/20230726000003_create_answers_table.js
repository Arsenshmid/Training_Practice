exports.up = function (knex) {
    return knex.schema.createTable('answers', (table) => {
      table.increments('id').primary();
      table.integer('question_id').notNullable().references('id').inTable('questions').onDelete('CASCADE');
      table.text('answer_text').notNullable();
      table.boolean('is_correct').notNullable().defaultTo(false);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('answers');
  };
  