import { safeLoad } from 'js-yaml'
import { inject } from 'inversify'
import TYPES from '../../types'
import FileService from '../files/fileService'
import { injectable } from 'inversify'
import { V1Job } from '@kubernetes/client-node'
import { JobType } from '../../models/job'
import * as path from 'path'

@injectable()
export default class JobFileService {

  public constructor(@inject(TYPES.FileService) private fileService: FileService) {}

  public getDefaultJobTemplate(type: JobType): V1Job {
    return safeLoad(this.fileService.readFileSync(`${path.join('resources', type)}.yaml`))
  }
}
