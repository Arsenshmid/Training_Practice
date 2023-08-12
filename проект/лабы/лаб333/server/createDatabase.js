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

// Создание таблиц
async function createTables() {
  try {
    await db.schema.createTableIfNotExists('clients', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
    });

    await db.schema.createTableIfNotExists('services', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.decimal('price').notNullable();
    });

    await db.schema.createTableIfNotExists('requests', (table) => {
      table.increments('id').primary();
      table.integer('client_id').unsigned();
      table.integer('service_id').unsigned();
    });

    console.log('Tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
}

createTables();
