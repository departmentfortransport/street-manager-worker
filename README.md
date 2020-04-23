# street-manager-worker

Application used to listen to Amazon Simple Queue Service (SQS) for messages that are emitted when a CSV export is requested.

A CSV export job is executed for the relevant CSV request using the retrieved csvId within the SQS message.

## Useful commands
```
npm install     # Retrieve dependencies
npm run build   # Compile application
npm start       # Run locally
npm test        # Run unit tests
```

