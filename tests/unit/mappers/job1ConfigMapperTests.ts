import 'mocha'
import { assert } from 'chai'
import Job1ConfigMapper from '../../../src/mappers/job1ConfigMapper'
import { Job1Config, Job1ConfigMapKey } from '../../../src/models/job1'
import { Job1Message } from '../../../src/models/message'
import { V1EnvVar } from '@kubernetes/client-node'
import { generateJob1Config, generateJob1Message } from '../../fixtures/job1Fixtures'

describe('Job1ConfigMapper', () => {

  let mapper: Job1ConfigMapper

  const CONFIG: Job1Config = {
    ...generateJob1Config(),
    JOB_1_INT_FIELD: 123,
    JOB_1_STR_FIELD: 'some string'
  }

  before(() => mapper = new Job1ConfigMapper(CONFIG))

  function assertEnvVar(actual: V1EnvVar, expectedName: string, expectedValue: string): void {
    assert.isDefined(actual)
    assert.equal(actual.name, expectedName)
    assert.equal(actual.value, expectedValue)
  }

  describe('mapToConfigMap', () => {
    it('should map the correct number of values to the config map list', () => {
      const message: Job1Message = generateJob1Message()

      const result: V1EnvVar[] = mapper.mapToConfigMap(message)

      assert.equal(result.length, 3)
    })

    it('should map the values from the message to the config map list', () => {
      const message: Job1Message = generateJob1Message()
      message.job_1_id_property = 123

      const result: V1EnvVar[] = mapper.mapToConfigMap(message)

      const idEnvVar: V1EnvVar = result.find(env => env.name === Job1ConfigMapKey.JOB_1_ID)

      assertEnvVar(idEnvVar, Job1ConfigMapKey.JOB_1_ID, '123')
    })

    it('should map the values from the job config to the config map list', () => {
      const message: Job1Message = generateJob1Message()

      const result: V1EnvVar[] = mapper.mapToConfigMap(message)

      const intEnvVar: V1EnvVar = result.find(env => env.name === Job1ConfigMapKey.JOB_1_INT_FIELD)
      const strEnvVar: V1EnvVar = result.find(env => env.name === Job1ConfigMapKey.JOB_1_STR_FIELD)

      assertEnvVar(intEnvVar, Job1ConfigMapKey.JOB_1_INT_FIELD, '123')
      assertEnvVar(strEnvVar, Job1ConfigMapKey.JOB_1_STR_FIELD, 'some string')
    })
  })
})
