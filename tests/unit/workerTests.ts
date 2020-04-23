import 'mocha'
import { mock, instance, when, verify, anything } from 'ts-mockito'
import Worker from '../../src/worker'
import JobCleanupService from '../../src/services/jobs/jobCleanupService'
import SQSService from '../../src/services/aws/sqsService'
import MessageService from '../../src/services/messageService'
import { Message } from 'aws-sdk/clients/sqs'
import { generateMessage } from '../fixtures/sqsFixtures'

describe('Worker', () => {

  let worker: Worker

  let cleanupService: JobCleanupService
  let sqs: SQSService
  let messageService: MessageService

  before(() => {
    cleanupService = mock(JobCleanupService)
    sqs = mock(SQSService)
    messageService = mock(MessageService)

    worker = new Worker(
      instance(cleanupService),
      instance(sqs),
      instance(messageService)
    )
  })

  describe('process', () => {
    it('should cleanup any stale jobs and fetch messages from SQS', async () => {
      when(sqs.receiveMessages()).thenResolve([])

      await worker.process()

      verify(cleanupService.cleanupJobs()).once()
      verify(sqs.receiveMessages()).once()
    })

    it('should handle each message retrieved from SQS', async () => {
      const message1: Message = generateMessage('Message 1')
      const message2: Message = generateMessage('Message 2')

      when(sqs.receiveMessages()).thenResolve([message1, message2])

      await worker.process()

      verify(messageService.handleMessage(anything())).twice()
      verify(messageService.handleMessage(message1)).once()
      verify(messageService.handleMessage(message2)).once()
    })
  })
})
