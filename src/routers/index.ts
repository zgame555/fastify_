import { FastifyInstance, FastifyRequest } from 'fastify'
import { MODE_TEST, config } from '../configs'
import { resCode } from '../libs/error'
import controllers from '../controllers'

const statusServer = async (req: FastifyRequest) => {
  return { code: resCode.success, message: 'Server is running' }
}

const index = async (req: FastifyRequest) => {
  return { code: resCode.success, name: config.name, server: req.hostname }
}

export async function routers(app: FastifyInstance) {
  if (MODE_TEST) {
  }
  app.get('/', index)
  app.get('/status', statusServer)
  app.get('/get', controllers.getResults)
}
