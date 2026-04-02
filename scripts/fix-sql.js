const fs = require('node:fs')

let sql = fs.readFileSync('./deploy/sql/nest_admin_pg.sql', 'utf8')

// 1. Fix sys_dict_type - add 'type' column between id and created_at
// Original: ("id", "created_at", "updated_at", ...)
// Fixed: ("id", "type", "created_at", "updated_at", ...)
sql = sql.replace(
  /INSERT INTO "sys_dict_type" \("id", "created_at", "updated_at", "create_by", "update_by", "name", "status", "remark", "code"\) VALUES \(1, /g,
  'INSERT INTO "sys_dict_type" ("id", "type", "created_at", "updated_at", "create_by", "update_by", "name", "status", "remark", "code") VALUES (1, \'sys_user_gender\', ',
)
sql = sql.replace(
  /INSERT INTO "sys_dict_type" \("id", "created_at", "updated_at", "create_by", "update_by", "name", "status", "remark", "code"\) VALUES \(2, /g,
  'INSERT INTO "sys_dict_type" ("id", "type", "created_at", "updated_at", "create_by", "update_by", "name", "status", "remark", "code") VALUES (2, \'sys_show_hide\', ',
)

// 2. Fix sys_role - add 'code' column and fix 'default' boolean
// Original: ("id", "value", "name", "remark", "status", "created_at", "updated_at", "default")
// Fixed: ("id", "value", "code", "name", "remark", "status", "created_at", "updated_at", "default")
sql = sql.replace(
  /INSERT INTO "sys_role" \("id", "value", "name", "remark", "status", "created_at", "updated_at", "default"\) VALUES \(1, 'admin', '管理员', '超级管理员', 1, /g,
  'INSERT INTO "sys_role" ("id", "value", "code", "name", "remark", "status", "created_at", "updated_at", "default") VALUES (1, \'admin\', \'admin\', \'管理员\', \'超级管理员\', 1, ',
)
sql = sql.replace(
  /INSERT INTO "sys_role" \("id", "value", "name", "remark", "status", "created_at", "updated_at", "default"\) VALUES \(2, 'user', '用户', '', 1, /g,
  'INSERT INTO "sys_role" ("id", "value", "code", "name", "remark", "status", "created_at", "updated_at", "default") VALUES (2, \'user\', \'user\', \'用户\', \'\', 1, ',
)
sql = sql.replace(
  /INSERT INTO "sys_role" \("id", "value", "name", "remark", "status", "created_at", "updated_at", "default"\) VALUES \(9, 'test', '测试', NULL, 1, /g,
  'INSERT INTO "sys_role" ("id", "value", "code", "name", "remark", "status", "created_at", "updated_at", "default") VALUES (9, \'test\', \'test\', \'测试\', NULL, 1, ',
)

// 3. Fix sys_role 'default' column values - NULL -> false, 1 -> true
sql = sql.replace(/, NULL\);$/gm, ', false);')
sql = sql.replace(/, 1, '2024-01-30 18:44:45.000000', 1\);/g, ', true, \'2024-01-30 18:44:45.000000\', false);')

// 4. Fix remaining is_ext values (line 245 has 1 instead of true)
sql = sql.replace(/, 1, 2, NULL\);$/gm, ', true, 2, NULL);')
sql = sql.replace(/, 0, 1, '字典管理'\);$/gm, ', false, 1, \'字典管理\');')
sql = sql.replace(/, 1, 2, NULL\);$/gm, ', true, 2, NULL);')

// 5. Fix tinyINT to SMALLINT (already done but verify)
sql = sql.replace(/tinyINT/g, 'SMALLINT')

fs.writeFileSync('./deploy/sql/nest_admin_pg.sql', sql)
console.log('SQL file fixed!')
