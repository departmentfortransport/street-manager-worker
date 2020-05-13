import { inject, injectable } from 'inversify'
import { Message } from 'aws-sdk/clients/sqs'
import SQSService from './services/aws/sqsService'
import TYPES from './types'
import JobCleanupService from './services/jobs/jobCleanupService'
import MessageService from './services/messageService'

@injectable()
export default class Worker {

  public constructor(
    @inject(TYPES.JobCleanupService) private cleanupService: JobCleanupService,
    @inject(TYPES.SQSService) private sqs: SQSService,
    @inject(TYPES.MessageService) private messageService: MessageService) {}

  public async process(): Promise<void> {
    await this.cleanupService.cleanupJobs()

    const messages: Message[] = await this.sqs.receiveMessages()

    await Promise.all(messages.map(message => this.messageService.handleMessage(message)))
  }
}
