import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import TYPES from '../../types'
import { MessageProcessor } from '../../models/messageProcessor'
import { Job1Message } from '../../models/message'
import JobService from '../jobs/jobService'
import { JobType } from '../../models/job'
import Job1ConfigMapper from '../../mappers/job1ConfigMapper'

@injectable()
export default class Job1MessageProcessor implements MessageProcessor {

  public constructor(
    @inject(TYPES.JobService) private jobService: JobService,
    @inject(TYPES.JOB_1_IAM_ROLE) private JOB_1_IAM_ROLE: string,
    @inject(TYPES.JOB_1_MAX_JOBS) private JOB_1_MAX_JOBS: number,
    @inject(TYPES.Job1ConfigMapper) private mapper: Job1ConfigMapper) {}

  public async process(message: Job1Message): Promise<boolean> {
    return this.jobService.processJob(message.job_1_id_property, JobType.Job1, this.JOB_1_MAX_JOBS, () => this.mapper.mapToConfigMap(message), this.JOB_1_IAM_ROLE)
  }
}
