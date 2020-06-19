import { JobDbConfig } from './job'

export interface GenerateSampleInspectionJobConfig extends JobDbConfig { }

export enum GenerateSampleInspectionConfigMapKey {
  GENERATE_SAMPLE_INSPECTIONS_JOB_ID = 'GENERATE_SAMPLE_INSPECTIONS_JOB_ID',
  PGHOST = 'PGHOST',
  PGPORT = 'PGPORT',
  PGDATABASE = 'PGDATABASE',
  PGUSER = 'PGUSER',
  PGPASSWORD = 'PGPASSWORD',
  PGMINPOOLSIZE = 'PGMINPOOLSIZE',
  PGMAXPOOLSIZE = 'PGMAXPOOLSIZE',
  PGSSL = 'PGSSL'
}
