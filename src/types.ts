const TYPES = {
  // Worker
  Worker: Symbol.for('Worker'),

  // App Config
  NAMESPACE: Symbol.for('NAMESPACE'),
  JOBS_TAG: Symbol.for('JOBS_TAG'),

  // AWS
  ECR_URL: Symbol.for('ECR_URL'),
  SQS_POLLING_INTERVAL: Symbol.for('SQS_POLLING_INTERVAL'),
  SQS_QUEUE_URL: Symbol.for('SQS_QUEUE_URL'),
  SQS: Symbol.for('SQS'),

  // Common services
  FileService: Symbol.for('FileService'),
  JobCleanupService: Symbol.for('JobCleanupService'),
  JobFileService: Symbol.for('JobFileService'),
  JobService: Symbol.for('JobService'),
  JobStatusService: Symbol.for('JobStatusService'),
  JobTemplateGenerator: Symbol.for('JobTemplateGenerator'),
  MessageService: Symbol.for('MessageService'),
  MessageProcessorDelegator: Symbol.for('MessageProcessorDelegator'),
  SQSService: Symbol.for('SQSService'),

  // Utils
  K8sBatchV1Api: Symbol.for('K8sBatchV1Api'),
  Logger: Symbol.for('Logger'),

  // Job 1
  JOB_1_IAM_ROLE: Symbol.for('JOB_1_IAM_ROLE'),
  JOB_1_MAX_JOBS: Symbol.for('JOB_1_MAX_JOBS'),
  JOB_1_CONFIG: Symbol.for('JOB_1_CONFIG'),
  Job1MessageProcessor: Symbol.for('Job1MessageProcessor'),
  Job1ConfigMapper: Symbol.for('Job1ConfigMapper')
}

export default TYPES
