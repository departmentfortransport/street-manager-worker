import iocContainer from './ioc'
import TYPES from './types'
import Worker from './worker'
import Logger from './utils/logger'

// Logger
const logger: Logger = iocContainer.get<Logger>(TYPES.Logger)

// Worker
const worker: Worker = iocContainer.get<Worker>(TYPES.Worker)

process.on('unhandledRejection', (reason: Error) => {
  console.error(`Unhandled rejection at: ${reason.stack}`)
})

run()

async function run() {
  logger.log('App starting...')

  while (true) {
    try {
      await worker.process()
    } catch (err) {
      logger.log(JSON.stringify(err))
    }
  }
}
