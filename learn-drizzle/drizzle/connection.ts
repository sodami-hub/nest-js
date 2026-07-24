import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.ts'; 
import * as relations from './relations.ts';
/* 위와같이 import 하면 schema.ts 파일에 정의된 users, comments 테이블을 가져올 수 있다.
schema = {
    users,
    comments,
}
*/

const pw = process.env.DB_PASSWORD;

if (!pw) {
    throw new Error('DB_PASSWORD is not defined in .env file');
}

const poolConnection = mysql.createPool({
    user: 'root',
    password: pw,
    host: 'localhost',
    port: 3306,
    database: 'nodejs',
    connectionLimit: 10,
});

export default drizzle({ client: poolConnection, schema:{...schema, ...relations}, mode: 'default' });
