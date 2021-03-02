// App
export const JOBS_TAG = 'v5.23.1'
export const NAMESPACE = process.env.NAMESPACE || 'local'

// AWS
export const AWS_REGION = process.env.AWS_REGION
export const ECR_URL = process.env.ECR_URL
export const SQS_POLLING_INTERVAL = process.env.SQS_POLLING_INTERVAL || 10
export const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL
export const SQS_CONNECT_TIMEOUT_MS = process.env.SQS_CONNECT_TIMEOUT_MS || (5 * 1000)
export const SQS_TIMEOUT_MS = process.env.SQS_TIMEOUT_MS || (120 * 1000)

// Generate Sample Inspections Job
export const GENERATE_SAMPLE_INSPECTION_MAX_JOBS = process.env.GENERATE_SAMPLE_INSPECTION_MAX_JOBS || '10'
export const GENERATE_SAMPLE_INSPECTION_PGHOST = process.env.GENERATE_SAMPLE_INSPECTION_PGHOST
export const GENERATE_SAMPLE_INSPECTION_PGPORT = process.env.GENERATE_SAMPLE_INSPECTION_PGPORT
export const GENERATE_SAMPLE_INSPECTION_PGDATABASE = process.env.GENERATE_SAMPLE_INSPECTION_PGDATABASE
export const GENERATE_SAMPLE_INSPECTION_PGUSER = process.env.GENERATE_SAMPLE_INSPECTION_PGUSER
export const GENERATE_SAMPLE_INSPECTION_PGPASSWORD = process.env.GENERATE_SAMPLE_INSPECTION_PGPASSWORD
export const GENERATE_SAMPLE_INSPECTION_PGMINPOOLSIZE = process.env.GENERATE_SAMPLE_INSPECTION_PGMINPOOLSIZE || '5'
export const GENERATE_SAMPLE_INSPECTION_PGMAXPOOLSIZE = process.env.GENERATE_SAMPLE_INSPECTION_PGMAXPOOLSIZE || '10'
export const GENERATE_SAMPLE_INSPECTION_PGSSL = process.env.GENERATE_SAMPLE_INSPECTION_PGSSL === 'true' || false
