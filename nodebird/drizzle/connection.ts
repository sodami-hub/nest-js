import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.ts';
import * as relations from './relations.ts';

const pw = process.env.DB_PASSWORD;

if (!pw) {
    throw new Error('DB_PASSWORD 환경 변수가 설정되지 않았습니다.');
}

const poolConnection = mysql.createPool({
    user: 'root',
    password: pw,
    host: 'localhost',
    port: 3306,
    database: 'nodebird',
    connectionLimit: 10,
});

export default drizzle({
    client: poolConnection,
    schema: { ...schema, ...relations },
    mode: 'default',
});

/*
database 에 스키마를 생성하고(create database nodebird)
$ npx drizzle-kit generate --name init // ./drizzle 폴도 안에  0000_init.sql 이 생성됨 해당 파일에는 sql 문이 적혀 있다.
$ npx drizzle-kit push // 해당 sql 문을 실행하여 database에 테이블 생성
*/
