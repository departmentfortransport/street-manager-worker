import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import { BaseMessage, MessageType } from '../models/message'
import { MessageProcessor } from '../models/messageProcessor'
import Job1MessageProcessor from './job-1/job1MessageProcessor'

@injectable()
export default class MessageProcessorDelegator {

  public constructor(@inject(TYPES.Job1MessageProcessor) private job1: Job1MessageProcessor) {}

  public getMessageProcessor(message: BaseMessage): MessageProcessor {
    switch (message.type) {
      case MessageType.job_1_message_type:
        return this.job1
      default:
        throw new Error(`The following message type is not valid: [${message.type}]`)
    }
  }
}
