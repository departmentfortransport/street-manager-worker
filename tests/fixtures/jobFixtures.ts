import { V1EnvVar, V1Job, V1JobList } from '@kubernetes/client-node'
import { JobStatus } from '../../src/models/job'
import { IncomingMessage } from 'http'

export function generateV1EnvVar(name = 'test', value = 'example'): V1EnvVar {
  return {
    name: name,
    value: value
  }
}

export function generateV1Job(name = 'some-job-name'): V1Job {
  return {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: name,
      labels: {
        app: 'jobs'
      }
    },
    spec: {
      template: {
        metadata: {
          labels: {
            app: 'jobs'
          },
          annotations: {
            'iam.amazonaws.com/role': 'change_me'
          }
        },
        spec: {
          containers: [
            {
              name: 'jobs',
              image: 'change_me',
              env: [
                generateV1EnvVar('TEST', 'change_me')
              ]
            }
          ]
        }
      }
    },
    status: {
      conditions: [
        {
          type: JobStatus.Complete,
          status: 'True'
        }
      ]
    }
  }
}

export function generateListNamespacedJobResponse(jobs: V1Job[]): { response: IncomingMessage, body: V1JobList } {
  return {
    response: null,
    body: {
      items: jobs
    }
  }
}
