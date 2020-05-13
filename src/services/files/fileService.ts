import { injectable } from 'inversify'
import * as fs from 'fs'

@injectable()
export default class FileService {

  public readFileSync(filepath: string): string {
    return fs.readFileSync(filepath, 'utf8')
  }
}
