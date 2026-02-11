export default () => {
  const currentAppVersionConfig = '1.0.0';

  if (!process.env.APP_POSTGRES_HOST || !process.env.APP_POSTGRES_PORT) {
    console.error('Ошибка: Переменные окружения для базы данных не загружены.');
    process.exit(1);
  }

  return {
    mode: process.env.NODE_ENV || 'development',
    version: currentAppVersionConfig,
    db: {
      postgres: {
        host: process.env.APP_POSTGRES_HOST,
        port: parseInt(process.env.APP_POSTGRES_PORT, 10) || 5432,
        db: process.env.APP_POSTGRES_DB || 'bp-pg',
        user: process.env.APP_POSTGRES_USER || 'postgres',
        password: process.env.APP_POSTGRES_PASSWORD || '1234',
      },
    },
    logger: {
      deployment: process.env.APP_LOGGER_DEPLOYMENT || 'production',
      microservice: process.env.APP_LOGGER_MICROSERVICE || 'REALTIME',
      environment: process.env.NODE_ENV || 'development',
      filterLevels: {
        whitelist: process.env.APP_LOGGER_LEVELS_WHITELIST
          ? process.env.APP_LOGGER_LEVELS_WHITELIST.split(',')
          : [],
        blacklist: process.env.APP_LOGGER_LEVELS_BLACKLIST
          ? process.env.APP_LOGGER_LEVELS_BLACKLIST.split(',')
          : [],
      },
      filterClasses: {
        whitelist: process.env.APP_LOGGER_CLASS_WHITELIST
          ? process.env.APP_LOGGER_CLASS_WHITELIST.split(',')
          : [],
        blacklist: process.env.APP_LOGGER_CLASS_BLACKLIST
          ? process.env.APP_LOGGER_CLASS_BLACKLIST.split(',')
          : [],
      },
    },
    auth: {
      secret: process.env.APP_AUTH_SECRET || 'secret',
      defaultExpirationTime: +process.env.APP_DEFAULT_EXP_TIME || 21600000,
    },
    featureFlags: {},
  };
};
