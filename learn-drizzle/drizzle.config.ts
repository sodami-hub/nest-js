import {defineConfig} from "drizzle-kit";

// process.loadEnvFile('.env');

const pw = process.env.DB_PASSWORD;

if (!pw) {
    throw new Error('DB_PASSWORD is not defined in .env file');
}

export default defineConfig({
    dialect: "mysql",
    schema: './drizzle/schema.ts',
    out: './drizzle',
    dbCredentials: {
        host:'localhost',
        port: 3306,
        user: 'root',
        password: pw,
        database: 'nodejs'
    },
});

// 여기까지 설정후 npx drizzle-kit pull 명령어를 실행하면 mysql 데이터베이스에 있는 테이블을 기반으로 
// ./drizzle/schema.ts 파일이 생성된다. (테이블이 없으면 빈 파일이 생성된다.)    