import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import TYPES from '../types'
import { GenerateSampleInspectionSQSMessage } from 'street-manager-data'
import { V1EnvVar } from '@kubernetes/client-node'
import { GenerateSampleInspectionJobConfig, GenerateSampleInspectionConfigMapKey } from '../models/generateSampleInspectionJob'
import JobConfigMapper from './jobConfigMapper'

@injectable()
export default class GenerateSampleInspectionConfigMapper extends JobConfigMapper {

  public constructor(@inject(TYPES.GENERATE_SAMPLE_INSPECTION_CONFIG) private CONFIG: GenerateSampleInspectionJobConfig) { super() }

  public mapToConfigMap(message: GenerateSampleInspectionSQSMessage): V1EnvVar[] {
    return [
      super.mapToEnvVar(GenerateSampleInspectionConfigMapKey.GENERATE_SAMPLE_INSPECTIONS_JOB_ID, message.job_id),
      super.mapToEnvVar(GenerateSampleInspectionConfigMapKey.PGHOST, this.CONFIG.PGHOST),
      super.mapToEnvVar(GenerateSampleInspectionConfigMapKey.PGPORT, this.CONFIG.PGPORT),
      super.mapToEnvVar(GenerateSampleInspectionConfigMapKey.PGDATABASE, this.CONFIG.PGDATABASE),
      super.mapToEnvVar(GenerateSampleInspectionConfigMapKey.PGUSER, this.CONFIG.PGUSER),
      super.mapToEnvVar(GenerateSampleInspectionConfigMapKey.PGPASSWORD, this.CONFIG.PGPASSWORD),
      super.mapToEnvVar(GenerateSampleInspectionConfigMapKey.PGMINPOOLSIZE, this.CONFIG.PGMINPOOLSIZE),
      super.mapToEnvVar(GenerateSampleInspectionConfigMapKey.PGMAXPOOLSIZE, this.CONFIG.PGMAXPOOLSIZE),
      super.mapToEnvVar(GenerateSampleInspectionConfigMapKey.PGSSL, `${this.CONFIG.PGSSL}`)
    ]
  }
}
