import 'mocha'
import { assert } from 'chai'
import MessageProcessorDelegator from '../../../src/services/messageProcessorDelegator'
import GenerateSampleInspectionMessageProcessor from '../../../src/services/generate-sample-inspection/generateSampleInspectionMessageProcessor'
import { MessageProcessor } from '../../../src/models/messageProcessor'
import { BaseMessage, MessageType } from 'street-manager-data'
import { generateBaseMessage } from '../../fixtures/messageFixtures'
import { mock, instance } from 'ts-mockito'

describe('MessageProcessorDelegator', () => {

  let delegator: MessageProcessorDelegator

  const job1: GenerateSampleInspectionMessageProcessor = instance(mock(GenerateSampleInspectionMessageProcessor))

  before(() => delegator = new MessageProcessorDelegator(job1))

  describe('getMessageProcessor', () => {
    it('should return the Job 1 processor when the provided message has the job 1 type', () => {
      const message: BaseMessage = generateBaseMessage(MessageType.generate_sample_inspection_job_type)

      const result: MessageProcessor = delegator.getMessageProcessor(message)

      assert.equal(result, job1)
    })

    it('should throw an error if an invalid message type is provided', () => {
      const message: BaseMessage = generateBaseMessage(<MessageType>'invalid')

      try {
        delegator.getMessageProcessor(message)
        assert.fail()
      } catch (err) {
        assert.equal(err.message, 'The following message type is not valid: [invalid]')
      }
    })
  })
})
