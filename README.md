# street-manager-worker

Application used to listen to Amazon Simple Queue Service (SQS) for messages that are emitted.

When a message is received, one of the following jobs will be started:
* Generate Sample Inspections

## Useful commands
```
npm install     # Retrieve dependencies
npm run build   # Compile application
npm start       # Run locally
npm test        # Run unit tests
```

