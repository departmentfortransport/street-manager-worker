import 'mocha'
import { assert } from 'chai'
import { mock, instance } from 'ts-mockito'
import { BaseMessage, MessageType } from 'street-manager-data'
import MessageProcessorDelegator from '../../../src/services/messageProcessorDelegator'
import GenerateSampleInspectionMessageProcessor from '../../../src/services/generate-sample-inspection/generateSampleInspectionMessageProcessor'
import { MessageProcessor } from '../../../src/models/messageProcessor'
import { generateBaseMessage } from '../../fixtures/messageFixtures'

describe('MessageProcessorDelegator', () => {

  let delegator: MessageProcessorDelegator

  const generateSampleInspectionsProcessor: GenerateSampleInspectionMessageProcessor = instance(mock(GenerateSampleInspectionMessageProcessor))

  before(() => delegator = new MessageProcessorDelegator(generateSampleInspectionsProcessor))

  describe('getMessageProcessor', () => {
    it('should return the Generate Sample Inspections processor when the provided message has the generate sample inspection type', () => {
      const message: BaseMessage = generateBaseMessage(MessageType.generate_sample_inspection_job_type)

      const result: MessageProcessor = delegator.getMessageProcessor(message)

      assert.equal(result, generateSampleInspectionsProcessor)
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
