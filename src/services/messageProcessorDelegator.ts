import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import { BaseMessage, MessageType } from 'street-manager-data'
import { MessageProcessor } from '../models/messageProcessor'
import GenerateSampleInspectionMessageProcessor from './generate-sample-inspection/generateSampleInspectionMessageProcessor'

@injectable()
export default class MessageProcessorDelegator {

  public constructor(@inject(TYPES.GenerateSampleInspectionMessageProcessor) private generateSampleInspection: GenerateSampleInspectionMessageProcessor) {}

  public getMessageProcessor(message: BaseMessage): MessageProcessor {
    switch (message.type) {
      case MessageType.generate_sample_inspection_job_type:
        return this.generateSampleInspection
      default:
        throw new Error(`The following message type is not valid: [${message.type}]`)
    }
  }
}
