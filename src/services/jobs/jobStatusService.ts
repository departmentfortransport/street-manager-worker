import { inject } from 'inversify'
import TYPES from '../../types'
import { injectable } from 'inversify'
import { V1Job, BatchV1Api } from '@kubernetes/client-node'
import { JobType, JobStatus } from '../../models/job'
import { Labels, LabelKey } from '../../models/labels'

@injectable()
export default class JobStatusService {

  public constructor(
    @inject(TYPES.K8sBatchV1Api) private k8s: BatchV1Api,
    @inject(TYPES.NAMESPACE) private NAMESPACE: string) {}

  public async getFinishedJobs(): Promise<V1Job[]> {
    return (await this.getJobs()).filter((job: V1Job) => job.metadata.labels?.[LabelKey.app] === Labels.app && this.isJobFinished(job))
  }

  public async getInProgressJobs(type: JobType): Promise<V1Job[]> {
    return (await this.getJobs()).filter((job: V1Job) => job.metadata.name.includes(type) && !this.isJobFinished(job))
  }

  private async getJobs(): Promise<V1Job[]> {
    return (await this.k8s.listNamespacedJob(this.NAMESPACE)).body.items
  }

  private isJobFinished(job: V1Job): boolean {
    return [JobStatus.Complete, JobStatus.Failed].includes(<JobStatus>job.status.conditions?.[0]?.type)
  }
}
