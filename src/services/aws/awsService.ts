import 'reflect-metadata'
import { AWSError } from 'aws-sdk'
import Logger from '../../utils/logger'
import { injectable } from 'inversify'

export type AWSCallback<Response> = (err: AWSError, response: Response) => void
export type AWSMethod<Request, Response> = (params: Request, callback: AWSCallback<Response>) => void

@injectable()
export default abstract class AWSService<Service> {

  private readonly ERROR_TIMEOUT: string = 'TimeoutError'

  protected constructor(
    protected service: Service,
    protected logger: Logger) {}

  protected toAWSPromise<Request, Response>(awsMethod: AWSMethod<Request, Response>, params: Request): Promise<Response> {
    return new Promise((resolve, reject) =>
      awsMethod.bind(this.service)(params, (err: AWSError, response: Response) => {
        if (err) {
          if (err.code === this.ERROR_TIMEOUT) {
            this.logger.error('Timeout Error')
          } else {
            this.logger.error('Error: ', err)
            return reject(err)
          }
        }

        return resolve(response)
      })
    )
  }
}
