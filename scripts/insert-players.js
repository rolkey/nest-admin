const { Pool } = require('pg')

const pool = new Pool({ host: '127.0.0.1', port: 5433, user: 'nest_admin', password: 'nest_admin123', database: 'nest_admin' })

async function main() {
  const client = await pool.connect()
  try {
    await client.query(`
      INSERT INTO competition_player (name, handicap, status) VALUES 
      ('黄曲', 0, 1),
      ('黄景晨', 0, 1),
      ('黎志', 0, 1),
      ('徐进', 0, 1),
      ('庞绍宇', 0, 1),
      ('马海军', 0, 1)
    `)
    const result = await client.query('SELECT * FROM competition_player')
    console.log('Players inserted:')
    console.log(result.rows)
  }
  finally {
    client.release()
    await pool.end()
  }
}

main().catch(console.error)
