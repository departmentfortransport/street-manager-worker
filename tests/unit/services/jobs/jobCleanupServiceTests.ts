import 'mocha'
import { mock, instance, when, verify, anything } from 'ts-mockito'
import JobCleanupService from '../../../../src/services/jobs/jobCleanupService'
import { BatchV1Api } from '@kubernetes/client-node'
import JobStatusService from '../../../../src/services/jobs/jobStatusService'
import { generateV1Job } from '../../../fixtures/jobFixtures'

describe('JobCleanupService', () => {

  let service: JobCleanupService

  let k8s: BatchV1Api
  let jobStatusService: JobStatusService

  const NAMESPACE = 'local'

  before(() => {
    k8s = mock(BatchV1Api)
    jobStatusService = mock(JobStatusService)

    service = new JobCleanupService(
      instance(k8s),
      instance(jobStatusService),
      NAMESPACE
    )
  })

  describe('cleanupJobs', () => {
    it('should not delete any jobs if none are marked as completed', async () => {
      when(jobStatusService.getFinishedJobs()).thenResolve([])

      await service.cleanupJobs()

      verify(k8s.deleteNamespacedJob(anything(), anything())).never()
    })

    it('should fetch completed jobs, extract their name and delete each of them', async () => {
      when(jobStatusService.getFinishedJobs()).thenResolve([generateV1Job('first-job'), generateV1Job('second-job')])

      await service.cleanupJobs()

      verify(k8s.deleteNamespacedJob(anything(), NAMESPACE)).twice()
      verify(k8s.deleteNamespacedJob('first-job', NAMESPACE)).once()
      verify(k8s.deleteNamespacedJob('second-job', NAMESPACE)).once()
    })
  })
})
