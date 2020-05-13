import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import TYPES from '../types'
import { Job1Message } from '../models/message'
import { V1EnvVar } from '@kubernetes/client-node'
import { Job1Config, Job1ConfigMapKey } from '../models/job1'
import JobConfigMapper from './jobConfigMapper'

@injectable()
export default class Job1ConfigMapper extends JobConfigMapper {

  public constructor(@inject(TYPES.JOB_1_CONFIG) private CONFIG: Job1Config) { super() }

  public mapToConfigMap(message: Job1Message): V1EnvVar[] {
    return [
      super.mapToEnvVar(Job1ConfigMapKey.JOB_1_ID, message.job_1_id_property),
      super.mapToEnvVar(Job1ConfigMapKey.JOB_1_INT_FIELD, this.CONFIG.JOB_1_INT_FIELD),
      super.mapToEnvVar(Job1ConfigMapKey.JOB_1_STR_FIELD, this.CONFIG.JOB_1_STR_FIELD),
      super.mapToEnvVar(Job1ConfigMapKey.PGHOST, this.CONFIG.PGHOST),
      super.mapToEnvVar(Job1ConfigMapKey.PGPORT, this.CONFIG.PGPORT),
      super.mapToEnvVar(Job1ConfigMapKey.PGDATABASE, this.CONFIG.PGDATABASE),
      super.mapToEnvVar(Job1ConfigMapKey.PGUSER, this.CONFIG.PGUSER),
      super.mapToEnvVar(Job1ConfigMapKey.PGPASSWORD, this.CONFIG.PGPASSWORD),
      super.mapToEnvVar(Job1ConfigMapKey.PGMINPOOLSIZE, this.CONFIG.PGMINPOOLSIZE),
      super.mapToEnvVar(Job1ConfigMapKey.PGMAXPOOLSIZE, this.CONFIG.PGMAXPOOLSIZE),
      super.mapToEnvVar(Job1ConfigMapKey.PGSSL, `${this.CONFIG.PGSSL}`)
    ]
  }
}
