import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import TYPES from '../../types'
import { MessageProcessor } from '../../models/messageProcessor'
import { GenerateSampleInspectionSQSMessage } from 'street-manager-data'
import JobService from '../jobs/jobService'
import { JobType } from '../../models/job'
import GenerateSampleInspectionConfigMapper from '../../mappers/generateSampleInspectionConfigMapper'

@injectable()
export default class GenerateSampleInspectionMessageProcessor implements MessageProcessor {

  public constructor(
    @inject(TYPES.JobService) private jobService: JobService,
    @inject(TYPES.GENERATE_SAMPLE_INSPECTION_MAX_JOBS) private GENERATE_SAMPLE_INSPECTION_MAX_JOBS: number,
    @inject(TYPES.GenerateSampleInspectionConfigMapper) private mapper: GenerateSampleInspectionConfigMapper) {}

  public async process(message: GenerateSampleInspectionSQSMessage): Promise<boolean> {
    console.log('message', message)
    return this.jobService.processJob(message.job_id, JobType.GenerateSampleInspection, this.GENERATE_SAMPLE_INSPECTION_MAX_JOBS, () => this.mapper.mapToConfigMap(message))
  }
}
