import 'mocha'
import { assert } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, when, verify, anything } from 'ts-mockito'
import JobService from '../../../../src/services/jobs/jobService'
import JobStatusService from '../../../../src/services/jobs/jobStatusService'
import { BatchV1Api, V1Job, V1EnvVar } from '@kubernetes/client-node'
import Logger from '../../../../src/utils/logger'
import JobTemplateGenerator from '../../../../src/services/jobs/jobTemplateGenerator'
import { JobType } from '../../../../src/models/job'
import { generateV1EnvVar, generateV1Job } from '../../../fixtures/jobFixtures'

describe('JobService', () => {

  let service: JobService

  let jobStatusService: JobStatusService
  let k8s: BatchV1Api
  let logger: Logger
  let templateGenerator: JobTemplateGenerator

  const NAMESPACE = 'local'

  beforeEach(() => {
    jobStatusService = mock(JobStatusService)
    k8s = mock(BatchV1Api)
    logger = mock(Logger)
    templateGenerator = mock(JobTemplateGenerator)

    service = new JobService(
      instance(jobStatusService),
      instance(k8s),
      NAMESPACE,
      instance(logger),
      instance(templateGenerator)
    )
  })

  describe('processJob', () => {
    const id = 123
    const maxJobs = 2
    const mockEnvVars: V1EnvVar[] = [generateV1EnvVar()]

    let getEnvStub: sinon.SinonStub

    beforeEach(() => getEnvStub = sinon.stub().returns(mockEnvVars))

    it('should not start the job, resolve false and log a message if the max number of jobs for the provided job type are already running', async () => {
      when(jobStatusService.getInProgressJobs(JobType.Job1)).thenResolve([
        generateV1Job(),
        generateV1Job(),
        generateV1Job()
      ])

      const result: boolean = await service.processJob(id, JobType.Job1, maxJobs, getEnvStub)

      assert.isFalse(result)

      verify(jobStatusService.getInProgressJobs(JobType.Job1)).called()
      verify(logger.log(`Job with type [${JobType.Job1}] not started as maximum concurrent jobs reached`)).called()
      verify(k8s.createNamespacedJob(anything(), anything())).never()
    })

    it('should generate the job template, start the job and resolve true if the max number of jobs for the provided job type has not yet been reached and the job started successfully', async () => {
      const job: V1Job = generateV1Job()

      when(jobStatusService.getInProgressJobs(JobType.Job1)).thenResolve([])
      when(templateGenerator.generateJobTemplate(id, JobType.Job1, mockEnvVars)).thenReturn(job)

      const result: boolean = await service.processJob(id, JobType.Job1, maxJobs, getEnvStub)

      assert.isTrue(result)

      assert.isTrue(getEnvStub.called)
      verify(templateGenerator.generateJobTemplate(id, JobType.Job1, mockEnvVars)).called()
      verify(k8s.createNamespacedJob(NAMESPACE, job)).called()

      verify(logger.log(anything())).never()
      verify(logger.error(anything(), anything())).never()
    })

    it('should resolve false and log the error if an unhandled exception occurs when trying to start the job', async () => {
      const job: V1Job = generateV1Job()
      const createJobError: Error = new Error()

      when(jobStatusService.getInProgressJobs(JobType.Job1)).thenResolve([])
      when(templateGenerator.generateJobTemplate(id, JobType.Job1, mockEnvVars)).thenReturn(job)
      when(k8s.createNamespacedJob(NAMESPACE, job)).thenReject(createJobError)

      const result: boolean = await service.processJob(id, JobType.Job1, maxJobs, getEnvStub)

      assert.isFalse(result)

      verify(k8s.createNamespacedJob(NAMESPACE, job)).called()
      verify(logger.error(`Job with type [${JobType.Job1}] not started due to error`, createJobError)).called()
    })
  })
})
