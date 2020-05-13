import { BaseMessage } from './message'

export interface MessageProcessor {
  process(message: BaseMessage): Promise<boolean>
}
