import 'reflect-metadata'
import { Container } from 'inversify'
import TYPES from './types'
import { NAMESPACE, JOBS_TAG, AWS_REGION, ECR_URL, SQS_POLLING_INTERVAL, SQS_QUEUE_URL, SQS_TIMEOUT_MS, SQS_CONNECT_TIMEOUT_MS, GENERATE_SAMPLE_INSPECTION_MAX_JOBS, GENERATE_SAMPLE_INSPECTION_PGHOST, GENERATE_SAMPLE_INSPECTION_PGPORT, GENERATE_SAMPLE_INSPECTION_PGDATABASE, GENERATE_SAMPLE_INSPECTION_PGUSER, GENERATE_SAMPLE_INSPECTION_PGPASSWORD, GENERATE_SAMPLE_INSPECTION_PGMINPOOLSIZE, GENERATE_SAMPLE_INSPECTION_PGMAXPOOLSIZE, GENERATE_SAMPLE_INSPECTION_PGSSL } from './config'
import { SQS } from 'aws-sdk'
import { BatchV1Api, KubeConfig } from '@kubernetes/client-node'
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
import { GenerateSampleInspectionJobConfig } from './models/generateSampleInspectionJob'
import GenerateSampleInspectionMessageProcessor from './services/generate-sample-inspection/generateSampleInspectionMessageProcessor'
import GenerateSampleInspectionConfigMapper from './mappers/generateSampleInspectionConfigMapper'

const iocContainer = new Container()

// Worker
iocContainer.bind<Worker>(TYPES.Worker).to(Worker)

// App Config
iocContainer.bind<string>(TYPES.NAMESPACE).toConstantValue(NAMESPACE)
iocContainer.bind<string>(TYPES.JOBS_TAG).toConstantValue(JOBS_TAG)

// AWS
iocContainer.bind<string>(TYPES.ECR_URL).toConstantValue(ECR_URL)
iocContainer.bind<number>(TYPES.SQS_POLLING_INTERVAL).toConstantValue(Number(SQS_POLLING_INTERVAL))
iocContainer.bind<string>(TYPES.SQS_QUEUE_URL).toConstantValue(SQS_QUEUE_URL)

iocContainer.bind<SQS>(TYPES.SQS).toConstantValue(
  new SQS({
    region: AWS_REGION,
    httpOptions: {
      connectTimeout: Number(SQS_CONNECT_TIMEOUT_MS),
      timeout: Number(SQS_TIMEOUT_MS)
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
const config: KubeConfig = new KubeConfig()
config.loadFromCluster()
iocContainer.bind<BatchV1Api>(TYPES.K8sBatchV1Api).toConstantValue(config.makeApiClient(BatchV1Api))

iocContainer.bind<Logger>(TYPES.Logger).to(Logger)

// Generate Sample Inspection

iocContainer.bind<number>(TYPES.GENERATE_SAMPLE_INSPECTION_MAX_JOBS).toConstantValue(Number(GENERATE_SAMPLE_INSPECTION_MAX_JOBS))
iocContainer.bind<GenerateSampleInspectionJobConfig>(TYPES.GENERATE_SAMPLE_INSPECTION_CONFIG).toConstantValue({
  PGHOST: GENERATE_SAMPLE_INSPECTION_PGHOST,
  PGPORT: GENERATE_SAMPLE_INSPECTION_PGPORT,
  PGDATABASE: GENERATE_SAMPLE_INSPECTION_PGDATABASE,
  PGUSER: GENERATE_SAMPLE_INSPECTION_PGUSER,
  PGPASSWORD: GENERATE_SAMPLE_INSPECTION_PGPASSWORD,
  PGMINPOOLSIZE: Number(GENERATE_SAMPLE_INSPECTION_PGMINPOOLSIZE),
  PGMAXPOOLSIZE: Number(GENERATE_SAMPLE_INSPECTION_PGMAXPOOLSIZE),
  PGSSL: Boolean(GENERATE_SAMPLE_INSPECTION_PGSSL)
})
iocContainer.bind<GenerateSampleInspectionMessageProcessor>(TYPES.GenerateSampleInspectionMessageProcessor).to(GenerateSampleInspectionMessageProcessor)
iocContainer.bind<GenerateSampleInspectionConfigMapper>(TYPES.GenerateSampleInspectionConfigMapper).to(GenerateSampleInspectionConfigMapper)

export default iocContainer
