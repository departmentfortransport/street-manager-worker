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
    JOB_1_STR_FIELD: 'some string',
    PGHOST: 'pg-host',
    PGPORT: '5432',
    PGDATABASE: 'pg-db',
    PGUSER: 'pg-user',
    PGPASSWORD: 'pg-pw',
    PGMINPOOLSIZE: 2,
    PGMAXPOOLSIZE: 5,
    PGSSL: true
  }

  before(() => mapper = new Job1ConfigMapper(CONFIG))

  function assertEnvVar(actualEnv: V1EnvVar[], expectedName: string, expectedValue: string): void {
    const actual: V1EnvVar = actualEnv.find(env => env.name === expectedName)

    assert.isDefined(actual)
    assert.equal(actual.name, expectedName)
    assert.equal(actual.value, expectedValue)
  }

  describe('mapToConfigMap', () => {
    it('should map the correct number of values to the config map list', () => {
      const message: Job1Message = generateJob1Message()

      const result: V1EnvVar[] = mapper.mapToConfigMap(message)

      assert.equal(result.length, 11)
    })

    it('should map the values from the message to the config map list', () => {
      const message: Job1Message = generateJob1Message()
      message.job_1_id_property = 123

      const result: V1EnvVar[] = mapper.mapToConfigMap(message)

      assertEnvVar(result, Job1ConfigMapKey.JOB_1_ID, '123')
    })

    it('should map the values from the job config to the config map list', () => {
      const message: Job1Message = generateJob1Message()

      const result: V1EnvVar[] = mapper.mapToConfigMap(message)

      assertEnvVar(result, Job1ConfigMapKey.JOB_1_INT_FIELD, '123')
      assertEnvVar(result, Job1ConfigMapKey.JOB_1_STR_FIELD, 'some string')
      assertEnvVar(result, Job1ConfigMapKey.PGHOST, 'pg-host')
      assertEnvVar(result, Job1ConfigMapKey.PGPORT, '5432')
      assertEnvVar(result, Job1ConfigMapKey.PGDATABASE, 'pg-db')
      assertEnvVar(result, Job1ConfigMapKey.PGUSER, 'pg-user')
      assertEnvVar(result, Job1ConfigMapKey.PGPASSWORD, 'pg-pw')
      assertEnvVar(result, Job1ConfigMapKey.PGMINPOOLSIZE, '2')
      assertEnvVar(result, Job1ConfigMapKey.PGMAXPOOLSIZE, '5')
      assertEnvVar(result, Job1ConfigMapKey.PGSSL, 'true')
    })
  })
})
