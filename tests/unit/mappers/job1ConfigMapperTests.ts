import 'mocha'
import { assert } from 'chai'
import GenerateSampleInspectionConfigMapper from '../../../src/mappers/generateSampleInspectionConfigMapper'
import { GenerateSampleInspectionJobConfig, GenerateSampleInspectionConfigMapKey } from '../../../src/models/generateSampleInspectionJob'
import { GenerateSampleInspectionSQSMessage } from 'street-manager-data'
import { V1EnvVar } from '@kubernetes/client-node'
import { generateSampleInspectionJobConfig, generateGenerateSampleInspectionSQSMessage } from '../../fixtures/generateSampleInspectionFixtures'

describe('GenerateSampleInspectionConfigMapper', () => {

  let mapper: GenerateSampleInspectionConfigMapper

  const CONFIG: GenerateSampleInspectionJobConfig = {
    ...generateSampleInspectionJobConfig(),
    PGHOST: 'pg-host',
    PGPORT: '5432',
    PGDATABASE: 'pg-db',
    PGUSER: 'pg-user',
    PGPASSWORD: 'pg-pw',
    PGMINPOOLSIZE: 2,
    PGMAXPOOLSIZE: 5,
    PGSSL: true
  }

  before(() => mapper = new GenerateSampleInspectionConfigMapper(CONFIG))

  function assertEnvVar(actualEnv: V1EnvVar[], expectedName: string, expectedValue: string): void {
    const actual: V1EnvVar = actualEnv.find(env => env.name === expectedName)

    assert.isDefined(actual)
    assert.equal(actual.name, expectedName)
    assert.equal(actual.value, expectedValue)
  }

  describe('mapToConfigMap', () => {
    it('should map the correct number of values to the config map list', () => {
      const message: GenerateSampleInspectionSQSMessage = generateGenerateSampleInspectionSQSMessage()

      const result: V1EnvVar[] = mapper.mapToConfigMap(message)

      assert.equal(result.length, 9)
    })

    it('should map the values from the message to the config map list', () => {
      const message: GenerateSampleInspectionSQSMessage = generateGenerateSampleInspectionSQSMessage()
      message.job_id = 123

      const result: V1EnvVar[] = mapper.mapToConfigMap(message)

      assertEnvVar(result, GenerateSampleInspectionConfigMapKey.GENERATE_SAMPLE_INSPECTIONS_JOB_ID, '123')
    })

    it('should map the values from the job config to the config map list', () => {
      const message: GenerateSampleInspectionSQSMessage = generateGenerateSampleInspectionSQSMessage()

      const result: V1EnvVar[] = mapper.mapToConfigMap(message)

      assertEnvVar(result, GenerateSampleInspectionConfigMapKey.PGHOST, 'pg-host')
      assertEnvVar(result, GenerateSampleInspectionConfigMapKey.PGPORT, '5432')
      assertEnvVar(result, GenerateSampleInspectionConfigMapKey.PGDATABASE, 'pg-db')
      assertEnvVar(result, GenerateSampleInspectionConfigMapKey.PGUSER, 'pg-user')
      assertEnvVar(result, GenerateSampleInspectionConfigMapKey.PGPASSWORD, 'pg-pw')
      assertEnvVar(result, GenerateSampleInspectionConfigMapKey.PGMINPOOLSIZE, '2')
      assertEnvVar(result, GenerateSampleInspectionConfigMapKey.PGMAXPOOLSIZE, '5')
      assertEnvVar(result, GenerateSampleInspectionConfigMapKey.PGSSL, 'true')
    })
  })
})
