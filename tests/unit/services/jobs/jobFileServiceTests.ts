import 'mocha'
import { assert } from 'chai'
import { mock, instance, when, verify } from 'ts-mockito'
import JobFileService from '../../../../src/services/jobs/jobFileService'
import FileService from '../../../../src/services/files/fileService'
import { V1Job } from '@kubernetes/client-node'
import { generateV1Job } from '../../../fixtures/jobFixtures'
import { safeDump } from 'js-yaml'
import { JobType } from '../../../../src/models/job'

describe('JobFileService', () => {

  let service: JobFileService

  let fileService: FileService

  before(() => {
    fileService = mock(FileService)

    service = new JobFileService(instance(fileService))
  })

  describe('getDefaultJobTemplate', () => {
    it('should retrieve the default template for the provided type and transform to JSON', () => {
      const job: V1Job = generateV1Job()

      when(fileService.readFileSync('resources/generate-sample-inspection.yaml')).thenReturn(safeDump(job))

      const result: V1Job = service.getDefaultJobTemplate(JobType.GenerateSampleInspection)

      assert.deepEqual(result, job)

      verify(fileService.readFileSync('resources/generate-sample-inspection.yaml')).once()
    })
  })
})
