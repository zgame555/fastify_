import fastify from 'fastify'
import { fastifyBull } from './src/libs/bull'
import { App } from './src/servers/app'

const app = fastify({ logger: false })
const server = async () => {
  try {

    await App(app)
  } catch (err) {
    console.log('error in server', err)

    process.exit(1)
  }
}
server()

fastifyBull().catch((err) => {
  console.log('err-server-bull', err)
})
