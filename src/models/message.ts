export enum MessageType {
  job_1_message_type = 'job_1_message_type'
}

export interface BaseMessage {
  type: MessageType
}

export interface Job1Message extends BaseMessage {
  job_1_id_property: number
}
