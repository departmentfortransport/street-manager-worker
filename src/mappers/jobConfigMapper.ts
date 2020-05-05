import 'reflect-metadata'
import { injectable } from 'inversify'
import { V1EnvVar } from '@kubernetes/client-node'

@injectable()
export default abstract class JobConfigMapper {

  protected mapToEnvVar(name: string, value: number | string): V1EnvVar {
    return {
      name: name,
      value: `${value}`
    }
  }
}
