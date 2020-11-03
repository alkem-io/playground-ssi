export default {
    type: 'sqlite',
    database: './db.sqlite3',
    logging: ['error', 'warn', 'schema'],
    entities: [ 'node_modules/@jolocom/sdk-storage-typeorm/js/src/entities/*.js' ],
    /** or if you list entity classes, then simply add the SDK entities
    entities: [
      // your entities here
      // then
      ...require('@jolocom/sdk-storage-typeorm').entityList
    ],
    */
   
    // migrations are recommended!
    migrations: ['./migrations/*.ts'],
    migrationsRun: true,
    synchronize: false,
    cli: {
      migrationsDir: './migrations',
    },
  }