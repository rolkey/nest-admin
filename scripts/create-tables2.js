const { Pool } = require('pg')

const pool = new Pool({
  host: '127.0.0.1',
  port: 5433,
  user: 'nest_admin',
  password: 'nest_admin123',
  database: 'nest_admin',
})

async function main() {
  const client = await pool.connect()
  try {
    // Create missing tables
    const tables = [
      `CREATE TABLE sys_user (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255),
        psalt VARCHAR(32),
        nickname VARCHAR(32),
        avatar VARCHAR(255),
        qq VARCHAR(50),
        email VARCHAR(50),
        phone VARCHAR(20),
        remark VARCHAR(255),
        status SMALLINT DEFAULT 1,
        dept_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(username)
      )`,
      `CREATE TABLE sys_role (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL,
        remark VARCHAR(255),
        status SMALLINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(code)
      )`,
      `CREATE TABLE sys_api (
        id SERIAL PRIMARY KEY,
        path VARCHAR(255),
        method VARCHAR(10),
        summary VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE sys_login_log (
        id SERIAL PRIMARY KEY,
        user_id INT,
        ip VARCHAR(50),
        user_agent TEXT,
        os VARCHAR(50),
        browser VARCHAR(50),
        status SMALLINT DEFAULT 1,
        msg VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE sys_task_log (
        id SERIAL PRIMARY KEY,
        task_id INT,
        status SMALLINT DEFAULT 0,
        detail TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE sys_role_menu (
        id SERIAL PRIMARY KEY,
        role_id INT NOT NULL,
        menu_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    ]

    for (const sql of tables) {
      try {
        await client.query(sql)
        console.log('Created table')
      }
      catch (e) {
        if (!e.message.includes('already exists')) {
          console.log('Error:', e.message.substring(0, 80))
        }
      }
    }
    console.log('Done')
  }
  finally {
    client.release()
    await pool.end()
  }
}

main().catch(console.error)
