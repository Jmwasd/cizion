const config = {
   development: {
      username: 'root',
      password: process.DB_SECRET,
      database: 'cizion',
      host: '127.0.0.1',
      dialect: 'mariadb',
   },
   test: {
      username: 'root',
      password: null,
      database: 'database_test',
      host: '127.0.0.1',
      dialect: 'mysql',
   },
   production: {
      username: 'root',
      password: null,
      database: 'database_production',
      host: '127.0.0.1',
      dialect: 'mysql',
   },
};

module.exports = config;
