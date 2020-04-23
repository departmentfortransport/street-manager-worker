import 'reflect-metadata'
import { Container } from 'inversify'
import TYPES from './types'
import { NAMESPACE , AWSREGION, TIMEOUT_SQS, TIMEOUT_INTERVAL } from './config'
import FileService from './services/files/fileService'
import JobService from './services/jobs/jobService'
import SQSService from './services/aws/sqsService'
import Logger from './utils/logger'
import Worker from './worker'
import { SQS } from 'aws-sdk'
import { KubeConfig, BatchV1Api } from '@kubernetes/client-node'
import JobCleanupService from './services/jobs/jobCleanupService'
import MessageProcessorDelegator from './services/messageProcessorDelegator'
import Job1MessageProcessor from './services/job-1/job1MessageProcessor'

const iocContainer = new Container()

iocContainer.bind<BatchV1Api>(TYPES.K8sBatchV1Api).toConstantValue(new KubeConfig().makeApiClient(BatchV1Api))

// Processors
iocContainer.bind<MessageProcessorDelegator>(TYPES.MessageProcessorDelegator).to(MessageProcessorDelegator)
iocContainer.bind<Job1MessageProcessor>(TYPES.Job1MessageProcessor).to(Job1MessageProcessor)

// Services
iocContainer.bind<FileService>(TYPES.FileService).to(FileService)
iocContainer.bind<JobService>(TYPES.JobService).to(JobService)
iocContainer.bind<JobCleanupService>(TYPES.JobCleanupService).to(JobCleanupService)
iocContainer.bind<SQSService>(TYPES.SQSService).to(SQSService)

iocContainer.bind<Logger>(TYPES.Logger).to(Logger)
iocContainer.bind<Worker>(TYPES.Worker).to(Worker)

// SQS
iocContainer.bind<SQS>(TYPES.SQS).toConstantValue(
  new SQS({
    region: AWSREGION,
    httpOptions: {
      connectTimeout: Number(TIMEOUT_SQS),
      timeout: Number(TIMEOUT_SQS)
    }
  })
)

// JOB
iocContainer.bind<number>(TYPES.TIMEOUT_INTERVAL).toConstantValue(Number(TIMEOUT_INTERVAL))
iocContainer.bind<string>(TYPES.NAMESPACE).toConstantValue(NAMESPACE)

export default iocContainer
