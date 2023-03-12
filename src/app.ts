import { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'
import { CustomError } from './libs/error'
import { config } from './configs'
import { routers } from './routers'

declare module 'fastify' {
  interface FastifyRequest {
    versionToken: string
    token: string
    apiserver: string
  }
}
const { host, port, redis } = config
export const App = async (app: FastifyInstance) => {
  app.register(fastifyCors)

  app.register(routers)

  app.addHook('onRequest', async (req, reply) => {
    console.log('\u001b[' + 36 + 'm' + `${req.headers['x-server'] || 'USER'}  =>  ${req.url} ` + '\u001b[0m')
  })

  app.setErrorHandler((error: any, request, reply) => {
    
    let { message, code, statusCode, data ,type}: CustomError = error

    code = code || type?.toUpperCase()


    reply.status(statusCode || 500).send({
      status: 'ERROR',
      code: code || 'OFFLINE',
      message: message || 'Please try again later',
      data: data,
    })
  })

  app.listen({ port, host }, (err, address) => {
    if (err) {
      console.log('error -> app', err)
    }
    console.log(`${address}`)
  })
}
