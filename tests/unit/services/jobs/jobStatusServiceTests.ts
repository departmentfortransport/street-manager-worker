import 'mocha'
import { assert } from 'chai'
import { mock, instance, when } from 'ts-mockito'
import JobStatusService from '../../../../src/services/jobs/jobStatusService'
import { BatchV1Api, V1Job } from '@kubernetes/client-node'
import { generateV1Job, generateListNamespacedJobResponse } from '../../../fixtures/jobFixtures'
import { JobStatus, JobType } from '../../../../src/models/job'

describe('JobStatusService', () => {

  let service: JobStatusService

  let k8s: BatchV1Api

  const NAMESPACE = 'local'

  before(() => {
    k8s = mock(BatchV1Api)

    service = new JobStatusService(
      instance(k8s),
      NAMESPACE
    )
  })

  describe('getFinishedJobs', () => {
    it('should only return jobs that have a condition type (status) of Complete or Failed', async () => {
      const completeJob: V1Job = generateV1Job()
      completeJob.status.conditions[0].type = JobStatus.Complete

      const failedJob: V1Job = generateV1Job()
      failedJob.status.conditions[0].type = JobStatus.Failed

      const inProgressJobWithoutConditions: V1Job = generateV1Job()
      inProgressJobWithoutConditions.status.conditions = null

      const inProgressJobWithEmptyConditions: V1Job = generateV1Job()
      inProgressJobWithEmptyConditions.status.conditions = []

      const allJobs: V1Job[] = [completeJob, failedJob, inProgressJobWithoutConditions, inProgressJobWithEmptyConditions]

      when(k8s.listNamespacedJob(NAMESPACE)).thenResolve(generateListNamespacedJobResponse(allJobs))

      const result: V1Job[] = await service.getFinishedJobs()

      assert.equal(result.length, 2)
      assert.equal(result[0], completeJob)
      assert.equal(result[1], failedJob)
    })
  })

  describe('getInProgressJobs', () => {
    it('should only return in progress jobs that also match the provided type', async () => {
      const completeJob: V1Job = generateV1Job(`${JobType.Job1}-123`)
      completeJob.status.conditions[0].type = JobStatus.Complete

      const failedJob: V1Job = generateV1Job(`${JobType.Job1}-456`)
      failedJob.status.conditions[0].type = JobStatus.Failed

      const inProgressJobWithoutConditions: V1Job = generateV1Job(`${JobType.Job1}-789`)
      inProgressJobWithoutConditions.status.conditions = null

      const inProgressJobWithEmptyConditions: V1Job = generateV1Job(`${JobType.Job1}-987`)
      inProgressJobWithEmptyConditions.status.conditions = []

      const inProgressJobWithDifferentType: V1Job = generateV1Job('other-type-job-654')
      inProgressJobWithDifferentType.status.conditions = []

      const allJobs: V1Job[] = [completeJob, failedJob, inProgressJobWithoutConditions, inProgressJobWithEmptyConditions, inProgressJobWithDifferentType]

      when(k8s.listNamespacedJob(NAMESPACE)).thenResolve(generateListNamespacedJobResponse(allJobs))

      const result: V1Job[] = await service.getInProgressJobs(JobType.Job1)

      assert.equal(result.length, 2)
      assert.equal(result[0], inProgressJobWithoutConditions)
      assert.equal(result[1], inProgressJobWithEmptyConditions)
    })
  })
})
