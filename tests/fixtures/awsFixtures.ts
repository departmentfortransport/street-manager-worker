import { AWSError } from'aws-sdk'

export function generateAWSError(code = 'some code'): AWSError {
  return <AWSError>{
    code: code,
    message: 'Something went wrong'
  }
}
