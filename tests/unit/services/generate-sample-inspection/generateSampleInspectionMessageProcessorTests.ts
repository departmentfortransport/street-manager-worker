import 'mocha'
import { assert } from 'chai'
import { mock, instance, when, verify, anyFunction } from 'ts-mockito'
import GenerateSampleInspectionMessageProcessor from '../../../../src/services/generate-sample-inspection/generateSampleInspectionMessageProcessor'
import JobService from '../../../../src/services/jobs/jobService'
import GenerateSampleInspectionConfigMapper from '../../../../src/mappers/generateSampleInspectionConfigMapper'
import { GenerateSampleInspectionSQSMessage } from 'street-manager-data'
import { generateGenerateSampleInspectionSQSMessage } from '../../../fixtures/generateSampleInspectionFixtures'
import { JobType } from '../../../../src/models/job'
import { V1EnvVar } from '@kubernetes/client-node'
import { generateV1EnvVar } from '../../../fixtures/jobFixtures'
import { GenerateSampleInspectionConfigMapKey } from '../../../../src/models/generateSampleInspectionJob'

describe('GenerateSampleInspectionMessageProcessor', () => {

  let processor: GenerateSampleInspectionMessageProcessor

  let jobService: JobService
  let mapper: GenerateSampleInspectionConfigMapper

  const GENERATE_SAMPLE_INSPECTION_MAX_JOBS = 10

  before(() => {
    jobService = mock(JobService)
    mapper = mock(GenerateSampleInspectionConfigMapper)

    processor = new GenerateSampleInspectionMessageProcessor(
      instance(jobService),
      GENERATE_SAMPLE_INSPECTION_MAX_JOBS,
      instance(mapper)
    )
  })

  describe('process', () => {
    const JOB_1_ID = 123

    const message: GenerateSampleInspectionSQSMessage = generateGenerateSampleInspectionSQSMessage()
    message.job_id = JOB_1_ID

    it('should process the job with the job-specific parameters, including ID field, job type and max number of jobs', async () => {
      await processor.process(message)

      verify(jobService.processJob(JOB_1_ID, JobType.GenerateSampleInspection, GENERATE_SAMPLE_INSPECTION_MAX_JOBS, anyFunction())).called()
    })

    it('should generate the config map values for the job', async () => {
      const mockEnvVars: V1EnvVar[] = [generateV1EnvVar(GenerateSampleInspectionConfigMapKey.GENERATE_SAMPLE_INSPECTIONS_JOB_ID, '123')]

      when(mapper.mapToConfigMap(message)).thenReturn(mockEnvVars)
      when(jobService.processJob(JOB_1_ID, JobType.GenerateSampleInspection, GENERATE_SAMPLE_INSPECTION_MAX_JOBS, anyFunction())).thenCall((id, type, maxJobs, getEnvFn) => {
        const mappedEnvVars: V1EnvVar[] = getEnvFn()

        assert.equal(mappedEnvVars, mockEnvVars)
      })

      await processor.process(message)

      verify(mapper.mapToConfigMap(message)).called()
    })

    it('should resolve true when the message is processed successfully', async () => {
      when(jobService.processJob(JOB_1_ID, JobType.GenerateSampleInspection, GENERATE_SAMPLE_INSPECTION_MAX_JOBS, anyFunction())).thenResolve(true)

      const result: boolean = await processor.process(message)

      assert.isTrue(result)
    })

    it('should resolve false when the message is processed successfully', async () => {
      when(jobService.processJob(JOB_1_ID, JobType.GenerateSampleInspection, GENERATE_SAMPLE_INSPECTION_MAX_JOBS, anyFunction())).thenResolve(false)

      const result: boolean = await processor.process(message)

      assert.isFalse(result)
    })
  })
})
