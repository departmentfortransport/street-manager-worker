import 'mocha'
import { assert } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, when, verify, deepEqual } from 'ts-mockito'
import MessageService from '../../../src/services/messageService'
import MessageProcessorDelegator from '../../../src/services/messageProcessorDelegator'
import SQSService from '../../../src/services/aws/sqsService'
import { BaseMessage, MessageType } from 'street-manager-data'
import { Message } from 'aws-sdk/clients/sqs'
import { generateBaseMessage } from '../../fixtures/messageFixtures'
import { generateMessage } from '../../fixtures/sqsFixtures'
import { MessageProcessor } from '../../../src/models/messageProcessor'

describe('MessageService', () => {

  let service: MessageService

  let delegator: MessageProcessorDelegator
  let sqs: SQSService

  beforeEach(() => {
    delegator = mock(MessageProcessorDelegator)
    sqs = mock(SQSService)

    service = new MessageService(
      instance(delegator),
      instance(sqs)
    )
  })

  describe('handleMessage', () => {
    const body: BaseMessage = generateBaseMessage(MessageType.generate_sample_inspection_job_type)

    const message: Message = generateMessage(JSON.stringify(body))

    let processMessageStub: sinon.SinonStub
    let mockMessageProcessor: MessageProcessor

    beforeEach(() => {
      processMessageStub = sinon.stub()
      mockMessageProcessor = {
        process: processMessageStub
      }

      when(delegator.getMessageProcessor(deepEqual(body))).thenReturn(mockMessageProcessor)
    })

    it('should determine the correct message processor from the provided message and process it', async () => {
      await service.handleMessage(message)

      verify(delegator.getMessageProcessor(deepEqual(body))).called()

      const actualMessageBody: BaseMessage = processMessageStub.getCall(0).args[0]
      assert.deepEqual(actualMessageBody, body)
    })

    it('should remove the message from SQS if it was successfully processed', async () => {
      processMessageStub.resolves(true)

      await service.handleMessage(message)

      verify(sqs.removeMessage(message)).once()
    })

    it('should remove the message from SQS if it was not successfully processed', async () => {
      processMessageStub.resolves(false)

      await service.handleMessage(message)

      verify(sqs.removeMessage(message)).never()
    })
  })
})
