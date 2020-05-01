import 'reflect-metadata'
import { Container } from 'inversify'
import TYPES from './types'
import { NAMESPACE, JOBS_TAG, AWS_REGION, ECR_URL, IAM_ROLE, SQS_POLLING_INTERVAL, SQS_QUEUE_URL, SQS_TIMEOUT, JOB_1_MAX_JOBS, JOB_1_INT_FIELD, JOB_1_STR_FIELD, JOB_1_PGHOST, JOB_1_PGPORT, JOB_1_PGDATABASE, JOB_1_PGUSER, JOB_1_PGPASSWORD, JOB_1_PGMINPOOLSIZE, JOB_1_PGMAXPOOLSIZE, JOB_1_PGSSL } from './config'
import { SQS } from 'aws-sdk'
import { KubeConfig, BatchV1Api } from '@kubernetes/client-node'
import Worker from './worker'
import FileService from './services/files/fileService'
import JobCleanupService from './services/jobs/jobCleanupService'
import JobFileService from './services/jobs/jobFileService'
import JobService from './services/jobs/jobService'
import JobStatusService from './services/jobs/jobStatusService'
import JobTemplateGenerator from './services/jobs/jobTemplateGenerator'
import MessageProcessorDelegator from './services/messageProcessorDelegator'
import MessageService from './services/messageService'
import SQSService from './services/aws/sqsService'
import Logger from './utils/logger'
import { Job1Config } from './models/job1'
import Job1MessageProcessor from './services/job-1/job1MessageProcessor'
import Job1ConfigMapper from './mappers/job1ConfigMapper'

const iocContainer = new Container()

// Worker
iocContainer.bind<Worker>(TYPES.Worker).to(Worker)

// App Config
iocContainer.bind<string>(TYPES.NAMESPACE).toConstantValue(NAMESPACE)
iocContainer.bind<string>(TYPES.JOBS_TAG).toConstantValue(JOBS_TAG)

// AWS
iocContainer.bind<string>(TYPES.ECR_URL).toConstantValue(ECR_URL)
iocContainer.bind<string>(TYPES.IAM_ROLE).toConstantValue(IAM_ROLE)
iocContainer.bind<number>(TYPES.SQS_POLLING_INTERVAL).toConstantValue(Number(SQS_POLLING_INTERVAL))
iocContainer.bind<string>(TYPES.SQS_QUEUE_URL).toConstantValue(SQS_QUEUE_URL)

iocContainer.bind<SQS>(TYPES.SQS).toConstantValue(
  new SQS({
    region: AWS_REGION,
    httpOptions: {
      connectTimeout: Number(SQS_TIMEOUT),
      timeout: Number(SQS_TIMEOUT)
    }
  })
)

// Common services
iocContainer.bind<FileService>(TYPES.FileService).to(FileService)
iocContainer.bind<JobCleanupService>(TYPES.JobCleanupService).to(JobCleanupService)
iocContainer.bind<JobFileService>(TYPES.JobFileService).to(JobFileService)
iocContainer.bind<JobService>(TYPES.JobService).to(JobService)
iocContainer.bind<JobStatusService>(TYPES.JobStatusService).to(JobStatusService)
iocContainer.bind<JobTemplateGenerator>(TYPES.JobTemplateGenerator).to(JobTemplateGenerator)
iocContainer.bind<MessageService>(TYPES.MessageService).to(MessageService)
iocContainer.bind<MessageProcessorDelegator>(TYPES.MessageProcessorDelegator).to(MessageProcessorDelegator)
iocContainer.bind<SQSService>(TYPES.SQSService).to(SQSService)

// Utils
iocContainer.bind<BatchV1Api>(TYPES.K8sBatchV1Api).toConstantValue(new KubeConfig().makeApiClient(BatchV1Api))
iocContainer.bind<Logger>(TYPES.Logger).to(Logger)

// Job 1
iocContainer.bind<number>(TYPES.JOB_1_MAX_JOBS).toConstantValue(Number(JOB_1_MAX_JOBS))
iocContainer.bind<Job1Config>(TYPES.JOB_1_CONFIG).toConstantValue({
  JOB_1_INT_FIELD: Number(JOB_1_INT_FIELD),
  JOB_1_STR_FIELD: JOB_1_STR_FIELD,
  PGHOST: JOB_1_PGHOST,
  PGPORT: JOB_1_PGPORT,
  PGDATABASE: JOB_1_PGDATABASE,
  PGUSER: JOB_1_PGUSER,
  PGPASSWORD: JOB_1_PGPASSWORD,
  PGMINPOOLSIZE: Number(JOB_1_PGMINPOOLSIZE),
  PGMAXPOOLSIZE: Number(JOB_1_PGMAXPOOLSIZE),
  PGSSL: Boolean(JOB_1_PGSSL)
})
iocContainer.bind<Job1MessageProcessor>(TYPES.Job1MessageProcessor).to(Job1MessageProcessor)
iocContainer.bind<Job1ConfigMapper>(TYPES.Job1ConfigMapper).to(Job1ConfigMapper)

export default iocContainer
