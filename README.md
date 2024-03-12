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
        accessKeyId: 'XXXXXXXXXXXXXXXX',
        secretAccessKey: 'XXXXXXXXXXXXXXXX'
    },
    region: 'ap-south-1',
    streamName: 'Test',
    shardIteratorType: 'TRIM_HORIZON',
    pollingDuration: 1000,
    limit: 1000
}
const consumer = new KinesisConsumer()

consumer.on('data', (record) => {
    console.log('Received data:', JSON.parse(Buffer.from(record.Data, 'base64').toString('utf-8')))
    console.log('Partition Key:', record.PartitionKey)
    console.log('Sequence Number:', record.SequenceNumber)
    console.log('Approximate Arrival Time:', record.ApproximateArrivalTimestamp)

}
)

consumer.on('error', (error) => {
    console.log('Error:', error)
}
)
consumer.startConsumer(options)
```

