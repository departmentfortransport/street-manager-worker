const TYPES = {
  // Utils
  K8sBatchV1Api: Symbol.for('K8sBatchV1Api'),

  // Mappers
  Job1ConfigMapper: Symbol.for('Job1ConfigMapper'),

  // Processors
  MessageProcessorDelegator: Symbol.for('MessageProcessorDelegator'),
  Job1MessageProcessor: Symbol.for('Job1MessageProcessor'),

  // Services
  AWSService: Symbol.for('AWSService'),
  BashService: Symbol.for('BashService'),
  JobFileService: Symbol.for('JobFileService'),
  JobStatusService: Symbol.for('JobStatusService'),
  JobTemplateGenerator: Symbol.for('JobTemplateGenerator'),
  FileService: Symbol.for('FileService'),
  JobService: Symbol.for('JobService'),
  JobCleanupService: Symbol.for('JobCleanupService'),
  MessageService: Symbol.for('MessageService'),
  SQSService: Symbol.for('SQSService'),
  YamlService: Symbol.for('YamlService'),

  SQS: Symbol.for('SQS'),
  Logger: Symbol.for('Logger'),
  Worker: Symbol.for('Worker'),

  // CSV job
  JOB_CONFIG: Symbol.for('JOB_CONFIG'),
  JOB_1_CONFIG: Symbol.for('JOB_1_CONFIG'),
  NAMESPACE: Symbol.for('NAMESPACE'),
  IAM_ROLE: Symbol.for('IAM_ROLE'),
  ECR_URL: Symbol.for('ECR_URL'),
  SQS_QUEUE_URL: Symbol.for('SQS_QUEUE_URL'),
  SQS_POLLING_INTERVAL: Symbol.for('SQS_POLLING_INTERVAL'),
  JOB_1_MAX_JOBS: Symbol.for('JOB_1_MAX_JOBS'),
  JOBS_TAG: Symbol.for('JOBS_TAG')
}

export default TYPES
