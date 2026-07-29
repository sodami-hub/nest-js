import { defineConfig } from 'drizzle-kit';

const pw = process.env.DB_PASSWORD;
if (!pw) {
  throw new Error('DB_PASSWORD environment variable is not set');
}

export default defineConfig({
  dialect: 'mysql',
  schema: './drizzle/schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: pw,
    database: 'nodebird',
  },
});
