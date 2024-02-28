const { Pool } = require('pg');
require("dotenv").config({ path: './.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
});

const createCategoriesTableQuery = `
  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
`;

const createProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`;

const dropTable = `
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS products;
`;

async function createTables() {
  try {
    const client = await pool.connect();
    // await client.query(dropTable); 
    await client.query(createCategoriesTableQuery);
    await client.query(createProductsTableQuery);
    console.log('Tables created successfully');
    client.release();
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

createTables();

module.exports = pool;