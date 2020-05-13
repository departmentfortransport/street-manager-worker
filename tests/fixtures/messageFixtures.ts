import { BaseMessage, MessageType } from '../../src/models/message'

export function generateBaseMessage(type: MessageType): BaseMessage {
  return {
    type: type
  }
}
