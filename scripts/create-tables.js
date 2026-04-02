const { Pool } = require('pg')

const pool = new Pool({
  host: '127.0.0.1',
  port: 5433,
  user: 'nest_admin',
  password: 'nest_admin123',
  database: 'nest_admin',
})

async function createTables() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS competition_player (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        handicap INT DEFAULT 0,
        status SMALLINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Table competition_player created')

    await client.query(`
      CREATE TABLE IF NOT EXISTS competition_match (
        id SERIAL PRIMARY KEY,
        match_time TIMESTAMP,
        status SMALLINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Table competition_match created')

    await client.query(`
      CREATE TABLE IF NOT EXISTS competition_match_player (
        id SERIAL PRIMARY KEY,
        match_id INT NOT NULL,
        player_id INT NOT NULL,
        handicap INT DEFAULT 0,
        is_winner SMALLINT DEFAULT 0,
        opponent_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Table competition_match_player created')

    console.log('All tables created successfully!')
  }
  finally {
    client.release()
    await pool.end()
  }
}

createTables().catch(console.error)
