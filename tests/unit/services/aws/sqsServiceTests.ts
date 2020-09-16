import 'mocha'
import { assert } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify } from 'ts-mockito'
import SQSService from '../../../../src/services/aws/sqsService'
import { SQS, AWSError } from 'aws-sdk'
import Logger from '../../../../src/utils/logger'
import { Message } from 'aws-sdk/clients/sqs'
import { generateMessage, generateReceiveMessageResult } from '../../../fixtures/sqsFixtures'
import { generateAWSError } from '../../../fixtures/awsFixtures'

describe('SQSService', () => {
  let sqsService: SQSService

  let sqs: SQS
  let logger: Logger

  const SQS_QUEUE_URL = 'some-queue-url'
  const SQS_POLLING_INTERVAL = 123

  beforeEach(() => {
    sqs = new SQS() // Stubbing individual methods using sinon due to AWS lib structure
    logger = mock(Logger)

    sqsService = new SQSService(
      sqs,
      SQS_QUEUE_URL,
      SQS_POLLING_INTERVAL,
      instance(logger)
    )
  })

  describe('receiveMessages', () => {
    it('should poll SQS with the correct parameters', async () => {
      const response: SQS.ReceiveMessageResult = generateReceiveMessageResult()

      const receiveStub: sinon.SinonStub = sinon.stub()
      sqs.receiveMessage = receiveStub.yields(null, response)

      await sqsService.receiveMessages()

      const params: SQS.ReceiveMessageRequest = receiveStub.getCall(0).args[0]

      assert.equal(params.QueueUrl, SQS_QUEUE_URL)
      assert.equal(params.WaitTimeSeconds, SQS_POLLING_INTERVAL)
      assert.equal(params.MaxNumberOfMessages, 1)
      assert.equal(params.VisibilityTimeout, 10)
    })

    it('should return an empty list if the response is empty', async () => {
      const response: SQS.ReceiveMessageResult = generateReceiveMessageResult()
      response.Messages = null

      sqs.receiveMessage = sinon.stub().yields(null, response)

      const messages: Message[] = await sqsService.receiveMessages()

      assert.isEmpty(messages)
    })

    it('should return a list of messages that should be processed', async () => {
      const response: SQS.ReceiveMessageResult = generateReceiveMessageResult()
      response.Messages = [
        generateMessage('message-1'),
        generateMessage('message-2')
      ]

      sqs.receiveMessage = sinon.stub().yields(null, response)

      const messages: Message[] = await sqsService.receiveMessages()

      assert.equal(messages.length, 2)
      assert.equal(messages[0].Body, 'message-1')
      assert.equal(messages[1].Body, 'message-2')
    })

    it('should reject an error if something goes wrong when trying to receive messages from SQS', async () => {
      const messagesError: Error = generateAWSError('Some error')
      sqs.receiveMessage = sinon.stub().yields(messagesError, null)

      try {
        await sqsService.receiveMessages()
        assert.fail()
      } catch (err) {
        assert.equal(err, messagesError)
      }

      verify(logger.error('Error: ', messagesError))
    })

    it('should resolve an empty list if a Timeout Error is received when trying to retrieve messages from SQS', async () => {
      const messagesError: AWSError = generateAWSError('TimeoutError')
      sqs.receiveMessage = sinon.stub().yields(messagesError, null)

      const result: Message[] = await sqsService.receiveMessages()

      assert.isEmpty(result)

      verify(logger.error('Timeout Error')).called()
    })
  })

  describe('removeMessage', () => {
    it('should delete the supplied message from SQS', async () => {
      const message: Message = generateMessage('some-message', 'some-receipt')

      const deleteStub: sinon.SinonStub = sinon.stub()
      sqs.deleteMessage = deleteStub.yields(null)

      await sqsService.removeMessage(message)

      const params: SQS.DeleteMessageRequest = deleteStub.getCall(0).args[0]

      assert.equal(params.QueueUrl, SQS_QUEUE_URL)
      assert.equal(params.ReceiptHandle, 'some-receipt')
    })

    it('should reject an error if something goes wrong when trying to remove messages from SQS', async () => {
      const message: Message = generateMessage('some-message', 'some-receipt')

      const messagesError: Error = new Error('remove-messages-error')
      sqs.deleteMessage = sinon.stub().yields(messagesError, null)

      try {
        await sqsService.removeMessage(message)
        assert.fail()
      } catch (err) {
        assert.equal(err, messagesError)
      }
    })
  })
})
