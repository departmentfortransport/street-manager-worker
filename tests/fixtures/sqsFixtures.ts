import { Message, ReceiveMessageResult } from 'aws-sdk/clients/sqs'

export function generateReceiveMessageResult(): ReceiveMessageResult {
  return {
    Messages: [generateMessage('Some SQS Message body')]
  }
}

export function generateMessage(body: string, receipt = 'Some receipt'): Message {
  return {
    Body: body,
    ReceiptHandle: receipt
  }
}
