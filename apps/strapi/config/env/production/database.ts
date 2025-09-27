export default ({ env }: { env: (key: string, defaultValue?: any) => any }) => {
  const parse = require("pg-connection-string").parse
  const config = parse(env("DATABASE_URL"))

  return {
    connection: {
      client: "postgres",
      connection: {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        ssl: {
          rejectUnauthorized: false,
        },
      },
      debug: false,
      pool: {
        min: 2,
        max: 10,
      },
    },
  }
}
