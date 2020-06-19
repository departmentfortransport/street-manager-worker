import { BaseMessage } from 'street-manager-data'

export interface MessageProcessor {
  process(message: BaseMessage): Promise<boolean>
}
