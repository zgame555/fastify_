import dotenv from 'dotenv'

dotenv.config()

const ENV = process.env
const port = Number(ENV.PORT) || 4466
const host = ENV.HOST || 'localhost'

export const config = {
  name: ENV.NAME_SERVER || 'TEST',
  port,
  host,
  apiserver: ENV.API_SERVER || `http://${host}:${port}`,
  env: ENV.NODE_ENV || 'DEVELOPMENT',

  bullPort: Number(ENV.BULL_PORT) || 4488,

  secret: {
    api: ENV.SECRET_API || 'CLIENT@789=>SERVER456',
    server: ENV.SECRET_SERVER || 'BANK-S-@DZCQS-!@FD%$FF',
  },
  redis: {
    port: Number(ENV.REDIS_PORT) || 6379,
    host: ENV.REDIS_HOST || 'localhost',
  },
 
}

export const MODE_TEST = ENV.MODE === 'TEST'
