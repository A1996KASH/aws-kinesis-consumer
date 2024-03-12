# aws-kinesis-consumer

This is a simple example of a Kinesis consumer using the AWS SDK for Node.js.

## Prerequisites

- Node.js
- AWS account
- AWS CLI

## Setup
Install aws-kinesis-consumer

```bash
npm install aws-kinesis-consumer
```


## Example Code
```javascript
const KinesisConsumer = require('aws-kinesis-consumer')

const options = {
    credentials: {
        accessKeyId: 'XXXXXXXXXXXXXXXX'
        secretAccessKey: 'XXXXXXXXXXXXXXXX'
    },
    region: 'ap-south-1',
    streamName: 'Test',
    shardIteratorType: 'TRIM_HORIZON',
    pollingDuration: 1000,
    limit: 1000
}
const consumer = new KinesisConsumer()

consumer.on('data', (data) => {
    console.log('Received data:', data)
}
)
consumer.on('error', (error) => {
    console.log('Error:', error)
}
)
consumer.startConsumer(options)
```

