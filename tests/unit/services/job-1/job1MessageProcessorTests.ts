import 'mocha'
import { assert } from 'chai'
import { mock, instance, when, verify, anyFunction } from 'ts-mockito'
import Job1MessageProcessor from '../../../../src/services/job-1/job1MessageProcessor'
import JobService from '../../../../src/services/jobs/jobService'
import Job1ConfigMapper from '../../../../src/mappers/job1ConfigMapper'
import { Job1Message } from '../../../../src/models/message'
import { generateJob1Message } from '../../../fixtures/job1Fixtures'
import { JobType } from '../../../../src/models/job'
import { V1EnvVar } from '@kubernetes/client-node'
import { generateV1EnvVar } from '../../../fixtures/jobFixtures'
import { Job1ConfigMapKey } from '../../../../src/models/job1'

describe('Job1MessageProcessor', () => {

  let processor: Job1MessageProcessor

  let jobService: JobService
  let mapper: Job1ConfigMapper

  const JOB_1_IAM_ROLE = 'Role'
  const JOB_1_MAX_JOBS = 10

  before(() => {
    jobService = mock(JobService)
    mapper = mock(Job1ConfigMapper)

    processor = new Job1MessageProcessor(
      instance(jobService),
      JOB_1_IAM_ROLE,
      JOB_1_MAX_JOBS,
      instance(mapper)
    )
  })

  describe('process', () => {
    const JOB_1_ID = 123

    const message: Job1Message = generateJob1Message()
    message.job_1_id_property = JOB_1_ID

    it('should process the job with the job-specific parameters, including ID field, job type and max number of jobs', async () => {
      await processor.process(message)

      verify(jobService.processJob(JOB_1_ID, JobType.Job1, JOB_1_MAX_JOBS, anyFunction(), JOB_1_IAM_ROLE)).called()
    })

    it('should generate the config map values for the job', async () => {
      const mockEnvVars: V1EnvVar[] = [generateV1EnvVar(Job1ConfigMapKey.JOB_1_ID, '123')]

      when(mapper.mapToConfigMap(message)).thenReturn(mockEnvVars)
      when(jobService.processJob(JOB_1_ID, JobType.Job1, JOB_1_MAX_JOBS, anyFunction(), JOB_1_IAM_ROLE)).thenCall((id, type, maxJobs, getEnvFn, job1IamRole) => {
        const mappedEnvVars: V1EnvVar[] = getEnvFn()

        assert.equal(mappedEnvVars, mockEnvVars)
      })

      await processor.process(message)

      verify(mapper.mapToConfigMap(message)).called()
    })

    it('should resolve true when the message is processed successfully', async () => {
      when(jobService.processJob(JOB_1_ID, JobType.Job1, JOB_1_MAX_JOBS, anyFunction(), JOB_1_IAM_ROLE)).thenResolve(true)

      const result: boolean = await processor.process(message)

      assert.isTrue(result)
    })

    it('should resolve false when the message is processed successfully', async () => {
      when(jobService.processJob(JOB_1_ID, JobType.Job1, JOB_1_MAX_JOBS, anyFunction(), JOB_1_IAM_ROLE)).thenResolve(false)

      const result: boolean = await processor.process(message)

      assert.isFalse(result)
    })
  })
})
