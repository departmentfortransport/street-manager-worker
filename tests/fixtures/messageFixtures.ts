import { BaseMessage, MessageType } from 'street-manager-data'

export function generateBaseMessage(type: MessageType, id = 123): BaseMessage {
  return {
    type: type,
    job_id: id
  }
}
