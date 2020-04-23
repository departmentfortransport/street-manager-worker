import { Job1Config } from '../../src/models/job1'
import { Job1Message, MessageType } from '../../src/models/message'
import { generateBaseMessage } from './messageFixtures'

export function generateJob1Config(): Job1Config {
  return {
    JOB_1_INT_FIELD: '123',
    JOB_1_STR_FIELD: 'some string',
    PGHOST: 'pg-host',
    PGPORT: '5432',
    PGDATABASE: 'pg-db',
    PGUSER: 'pg-user',
    PGPASSWORD: 'pg-pw',
    PGMINPOOLSIZE: '2',
    PGMAXPOOLSIZE: '5',
    PGSSL: 'true'
  }
}

export function generateJob1Message(): Job1Message {
  return {
    ...generateBaseMessage(MessageType.job_1_message_type),
    job_1_id_property: 123
  }
}
