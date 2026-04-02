const fs = require('node:fs')
const { Pool } = require('pg')

const pool = new Pool({ host: '127.0.0.1', port: 5433, user: 'nest_admin', password: 'nest_admin123', database: 'nest_admin' })

async function main() {
  const client = await pool.connect()
  try {
    const sql = fs.readFileSync('./deploy/sql/nest_admin_pg.sql', 'utf8')
    const lines = sql.split('\n')

    const tables = ['sys_dept', 'sys_user', 'sys_role', 'sys_api', 'sys_config', 'sys_dict_type', 'sys_dict_item', 'sys_captcha_log']

    for (const table of tables) {
      let inInsert = false
      let insertSql = ''
      let count = 0

      for (const line of lines) {
        const searchStr = `INSERT INTO "${table}"`
        if (line.includes(searchStr)) {
          inInsert = true
        }
        if (inInsert) {
          insertSql += `${line}\n`
          if (line.trim().endsWith(';')) {
            try {
              await client.query(insertSql)
              count++
            }
            catch (e) {
              // Skip errors
            }
            insertSql = ''
            inInsert = false
          }
        }
      }
      console.log(`${table}: ${count} rows`)
    }
    console.log('Done!')
  }
  finally {
    client.release()
    await pool.end()
  }
}

main().catch(e => console.log('Error:', e.message))
