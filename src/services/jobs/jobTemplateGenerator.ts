import { inject } from 'inversify'
import TYPES from '../../types'
import { injectable } from 'inversify'
import { V1Job, V1EnvVar } from '@kubernetes/client-node'
import JobFileService from './jobFileService'
import { JobType } from '../../models/job'

@injectable()
export default class JobTemplateGenerator {

  public constructor(
    @inject(TYPES.JobFileService) private fileService: JobFileService,
    @inject(TYPES.IAM_ROLE) private IAM_ROLE: string,
    @inject(TYPES.ECR_URL) private ECR_URL: string,
    @inject(TYPES.JOBS_TAG) private JOBS_TAG: string) {}

  public generateJobTemplate(id: number, type: JobType, env: V1EnvVar[]): V1Job {
    const job: V1Job = this.fileService.getDefaultJobTemplate(type)

    job.metadata.name = `${type}-${id}`

    job.spec.template.metadata.annotations['iam.amazonaws.com/role'] = this.IAM_ROLE
    job.spec.template.spec.containers[0].image = `${this.ECR_URL}:${this.JOBS_TAG}`

    job.spec.template.spec.containers[0].env = env

    return job
  }
}
