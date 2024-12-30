import { MYSQL_CONFIGS_PRD, MYSQL_CONFIGS_DEV } from './configs';
import { initialize } from 'app-schema';

export const createKysely = (mode: 'development' | 'production' = 'development') => {
  if (mode === 'development') {
    return initialize({
      database: MYSQL_CONFIGS_DEV.DATABASE,
      host: MYSQL_CONFIGS_DEV.HOST,
      user: MYSQL_CONFIGS_DEV.USER,
      password: MYSQL_CONFIGS_DEV.PASSWORD,
      port: MYSQL_CONFIGS_DEV.PORT,
      connectionLimit: 100,
    });
  }
  return initialize({
    database: MYSQL_CONFIGS_PRD.DATABASE,
    host: MYSQL_CONFIGS_PRD.HOST,
    user: MYSQL_CONFIGS_PRD.USER,
    password: MYSQL_CONFIGS_PRD.PASSWORD,
    port: MYSQL_CONFIGS_PRD.PORT,
    connectionLimit: 100,
    ssl: { ca: MYSQL_CONFIGS_PRD.CA },
  });
};
