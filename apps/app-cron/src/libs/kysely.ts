import { initialize } from 'app-schema';

export const createKysely = (mode: 'development' | 'production' = 'development') => {
  if (mode === 'development') {
    return initialize({
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.MYSQL_PORT,
      connectionLimit: 100,
    });
  }
  return initialize({
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    connectionLimit: 100,
    ssl: { ca: process.env.MYSQL_CA },
  });
};
