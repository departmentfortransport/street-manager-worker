import 'reflect-metadata'
import { Message } from 'aws-sdk/clients/sqs'
import { inject, injectable } from 'inversify'
import TYPES from '../types'
import SQSService from './aws/sqsService'
import { BaseMessage } from '../models/message'
import MessageProcessorDelegator from './messageProcessorDelegator'

@injectable()
export default class MessageService {

  public constructor(
    @inject(TYPES.MessageProcessorDelegator) private delegator: MessageProcessorDelegator,
    @inject(TYPES.SQSService) private sqs: SQSService) {}

  public async handleMessage(message: Message): Promise<void> {
    const parsedMessage: BaseMessage = JSON.parse(message.Body)

    const wasMessageProcessed: boolean = await this.delegator.getMessageProcessor(parsedMessage).process(parsedMessage)

    if (wasMessageProcessed) {
      await this.sqs.removeMessage(message)
    }
  }
}
