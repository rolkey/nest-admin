const { Pool } = require('pg')

const pool = new Pool({ host: '127.0.0.1', port: 5433, user: 'nest_admin', password: 'nest_admin123', database: 'nest_admin' })

async function main() {
  const client = await pool.connect()
  try {
    const tables = ['sys_user', 'sys_api', 'sys_dict_type', 'sys_dict_item', 'sys_captcha_log']
    for (const t of tables) {
      const r = await client.query(`SELECT COUNT(*) as cnt FROM "${t}"`)
      console.log(`${t}: ${r.rows[0].cnt}`)
    }
  }
  finally {
    client.release()
    await pool.end()
  }
}

main().catch(e => console.log('Error:', e.message))
