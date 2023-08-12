// createTables.js

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

async function createTables() {
  try {
    await db.schema.createTable('clients', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
    });

    await db.schema.createTable('services', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.decimal('price').notNullable();
    });

    await db.schema.createTable('requests', (table) => {
      table.increments('id').primary();
      table.integer('client_id').unsigned().references('id').inTable('clients');
      table.integer('service_id').unsigned().references('id').inTable('services');
    });

    console.log('Tables created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

createTables();
