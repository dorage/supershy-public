import { Kysely, MysqlDialect, ParseJSONResultsPlugin } from 'kysely';
import { createPool } from 'mysql2'; // do not use 'mysql2/promises'!
import { DB } from 'app-schema';

const dialect = new MysqlDialect({
  pool: async () =>
    createPool({
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.MYSQL_PORT,
      connectionLimit: 100,
      ssl: process.env.MODE === 'production' ? { ca: process.env.MYSQL_CA } : undefined,
    }),
});

export const Ky = new Kysely<DB>({
  dialect,
  plugins: [new ParseJSONResultsPlugin()],
});
