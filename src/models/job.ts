export enum JobType {
  GenerateSampleInspection = 'generate-sample-inspection'
}

export enum JobStatus {
  Complete = 'Complete',
  Failed = 'Failed'
}

export interface JobDbConfig {
  PGHOST: string
  PGPORT: string
  PGDATABASE: string
  PGUSER: string
  PGPASSWORD: string
  PGMINPOOLSIZE: number
  PGMAXPOOLSIZE: number
  PGSSL: boolean
}
