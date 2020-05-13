// App
export const JOBS_TAG = 'v1.0.0'
export const NAMESPACE = process.env.NAMESPACE || 'local'

// AWS
export const AWS_REGION = process.env.AWS_REGION
export const ECR_URL = process.env.ECR_URL
export const SQS_POLLING_INTERVAL = process.env.SQS_POLLING_INTERVAL || 10
export const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL
export const SQS_CONNECT_TIMEOUT_MS = process.env.SQS_CONNECT_TIMEOUT_MS || (5 * 1000)
export const SQS_TIMEOUT_MS = process.env.SQS_TIMEOUT_MS || (120 * 1000)

// Job 1
export const JOB_1_IAM_ROLE = process.env.JOB_1_IAM_ROLE
export const JOB_1_MAX_JOBS = process.env.JOB_1_MAX_JOBS || '10'
export const JOB_1_INT_FIELD = process.env.JOB_1_INT_FIELD || '12'
export const JOB_1_STR_FIELD = process.env.JOB_1_STR_FIELD || 'String Field'
export const JOB_1_PGHOST = process.env.JOB_1_PGHOST || 'localhost'
export const JOB_1_PGPORT = process.env.JOB_1_PGPORT || '5432'
export const JOB_1_PGDATABASE = process.env.JOB_1_PGDATABASE || 'work'
export const JOB_1_PGUSER = process.env.JOB_1_PGUSER || 'app'
export const JOB_1_PGPASSWORD = process.env.JOB_1_PGPASSWORD || 'app'
export const JOB_1_PGMINPOOLSIZE = process.env.JOB_1_PGMINPOOLSIZE || '5'
export const JOB_1_PGMAXPOOLSIZE = process.env.JOB_1_PGMAXPOOLSIZE || '10'
export const JOB_1_PGSSL = process.env.PGSSL === 'true' || false
