import { SQS } from 'aws-sdk'
import { Message } from 'aws-sdk/clients/sqs'
import AWSService from './awsService'
import Logger from '../../utils/logger'
import { inject } from 'inversify'
import TYPES from '../../types'
import { injectable } from 'inversify'

@injectable()
export default class SQSService extends AWSService<SQS> {

  public constructor(
    @inject(TYPES.SQS) private sqs: SQS,
    @inject(TYPES.SQS_QUEUE_URL) private SQS_QUEUE_URL: string,
    @inject(TYPES.SQS_POLLING_INTERVAL) private SQS_POLLING_INTERVAL: number,
    @inject(TYPES.Logger) logger: Logger) { super(sqs, logger) }

  public async receiveMessages(): Promise<Message[]> {
    const params: SQS.ReceiveMessageRequest = {
      QueueUrl: this.SQS_QUEUE_URL,
      WaitTimeSeconds: this.SQS_POLLING_INTERVAL,
      VisibilityTimeout: 10,
      MaxNumberOfMessages: 1
    }

    const result: SQS.ReceiveMessageResult = await super.toAWSPromise<SQS.ReceiveMessageRequest, SQS.ReceiveMessageResult>(this.sqs.receiveMessage, params)
    return result?.Messages || []
  }

  public async removeMessage(message: Message): Promise<void> {
    const params: SQS.DeleteMessageRequest = {
      QueueUrl: this.SQS_QUEUE_URL,
      ReceiptHandle: message.ReceiptHandle
    }

    await super.toAWSPromise<SQS.DeleteMessageRequest, {}>(this.sqs.deleteMessage, params)
  }
}
