import 'mocha'
import { assert } from 'chai'
import { mock, instance, when } from 'ts-mockito'
import JobTemplateGenerator from '../../../../src/services/jobs/jobTemplateGenerator'
import JobFileService from '../../../../src/services/jobs/jobFileService'
import { JobType } from '../../../../src/models/job'
import { V1Job, V1EnvVar } from '@kubernetes/client-node'
import { generateV1Job, generateV1EnvVar } from '../../../fixtures/jobFixtures'

describe('JobTemplateGenerator', () => {

  let generator: JobTemplateGenerator

  let fileService: JobFileService

  const IAM_ROLE = 'some-aws-role'
  const ECR_URL = 'some-ecr-url'
  const JOBS_TAG = 'v1.2.3'

  before(() => {
    fileService = mock(JobFileService)

    generator = new JobTemplateGenerator(
      instance(fileService),
      IAM_ROLE,
      ECR_URL,
      JOBS_TAG
    )
  })

  describe('generateJobTemplate', () => {
    const id = 123
    const env: V1EnvVar[] = [generateV1EnvVar()]

    let job: V1Job

    beforeEach(() => {
      job = generateV1Job()
      when(fileService.getDefaultJobTemplate(JobType.Job1)).thenReturn(job)
    })

    it('should generate the job name using the job type value and id to ensure uniqueness', () => {
      const result: V1Job = generator.generateJobTemplate(id, JobType.Job1, env)

      assert.equal(result.metadata.name, 'job-1-123')
    })

    it('should pass the IAM role to the template', () => {
      const result: V1Job = generator.generateJobTemplate(id, JobType.Job1, env)

      assert.equal(result.spec.template.metadata.annotations['iam.amazonaws.com/role'], IAM_ROLE)
    })

    it('should generate the job image using the ECR URL and Jobs tag version', () => {
      const result: V1Job = generator.generateJobTemplate(id, JobType.Job1, env)

      assert.equal(result.spec.template.spec.containers[0].image, 'some-ecr-url:v1.2.3')
    })

    it('should bind the provided environment variables to the template', () => {
      const result: V1Job = generator.generateJobTemplate(id, JobType.Job1, env)

      assert.equal(result.spec.template.spec.containers[0].env, env)
    })
  })
})
