import { FastifyRequest } from 'fastify'

const getResults = async (request: FastifyRequest) => {
  return { status: 'OK' }
}

export default {
  getResults,
}
