import 'reflect-metadata'
import { V1EnvVar } from '@kubernetes/client-node'

export default abstract class JobConfigMapper {

  protected mapToEnvVar(name: string, value: number | string): V1EnvVar {
    return {
      name: name,
      value: `${value}`
    }
  }
}
