import { GenerateSampleInspectionJobConfig } from '../../src/models/generateSampleInspectionJob'
import { GenerateSampleInspectionSQSMessage, MessageType } from 'street-manager-data'
import { generateBaseMessage } from './messageFixtures'

export function generateSampleInspectionJobConfig(): GenerateSampleInspectionJobConfig {
  return {
    PGHOST: 'pg-host',
    PGPORT: '5432',
    PGDATABASE: 'pg-db',
    PGUSER: 'pg-user',
    PGPASSWORD: 'pg-pw',
    PGMINPOOLSIZE: 2,
    PGMAXPOOLSIZE: 5,
    PGSSL: true
  }
}

export function generateGenerateSampleInspectionSQSMessage(): GenerateSampleInspectionSQSMessage {
  return {
    ...generateBaseMessage(MessageType.generate_sample_inspection_job_type)
  }
}
