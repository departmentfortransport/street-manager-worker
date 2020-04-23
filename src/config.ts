// App
export const JOBS_TAG = 'v1.0.0'
export const NAMESPACE = process.env.NAMESPACE || 'local'

// AWS
export const AWS_REGION = process.env.AWS_REGION
export const ECR_URL = process.env.ECR_URL
export const IAM_ROLE = process.env.IAM_ROLE
export const SQS_POLLING_INTERVAL = process.env.SQS_POLLING_INTERVAL || 10
export const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL
export const SQS_TIMEOUT = process.env.SQS_TIMEOUT || (5 * 1000)

// Job 1
export const JOB_1_MAX_JOBS = process.env.JOB_1_MAX_JOBS || 10
export const JOB_1_INT_FIELD = process.env.JOB_1_INT_FIELD || 123
export const JOB_1_STR_FIELD = process.env.JOB_1_STR_FIELD || 'string'
