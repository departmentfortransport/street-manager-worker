import { inject } from 'inversify'
import TYPES from '../../types'
import { injectable } from 'inversify'
import Logger from '../../utils/logger'
import { V1Job, BatchV1Api, V1EnvVar } from '@kubernetes/client-node'
import JobTemplateGenerator from './jobTemplateGenerator'
import { JobType } from '../../models/job'
import JobStatusService from './jobStatusService'

@injectable()
export default class JobService {

  public constructor(
    @inject(TYPES.JobStatusService) private jobStatusService: JobStatusService,
    @inject(TYPES.K8sBatchV1Api) private k8s: BatchV1Api,
    @inject(TYPES.NAMESPACE) private NAMESPACE: string,
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.JobTemplateGenerator) private templateGenerator: JobTemplateGenerator) {}

  public async processJob(id: number, type: JobType, maxJobs: number, getEnvFn: () => V1EnvVar[]): Promise<boolean> {
    try {
      if (await this.isMaxJobsInProgress(type, maxJobs)) {
        this.logger.log(`Job with type [${type}] not started as maximum concurrent jobs reached`)
        return false
      }

      const job: V1Job = this.templateGenerator.generateJobTemplate(id, type, getEnvFn())

      await this.k8s.createNamespacedJob(this.NAMESPACE, job)
    } catch (err) {
      this.logger.error(`Job with type [${type}] not started due to error`, err)
      return false
    }

    return true
  }

  private async isMaxJobsInProgress(type: JobType, maxJobs: number): Promise<boolean> {
    return (await this.jobStatusService.getInProgressJobs(type)).length >= maxJobs
  }
}
