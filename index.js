const { KinesisClient, GetShardIteratorCommand, GetRecordsCommand, ListShardsCommand } = require("@aws-sdk/client-kinesis");
const { EventEmitter } = require('events');

class KinesisConsumer extends EventEmitter {
    constructor() {
        super();
    }

    async startConsumer(options) {
        const { credentials, region, streamName, shardIteratorType, pollingDuration, limit = 10 } = options;
        // Check limit is between 1 and 10000 and polling duration is not less than 1000
        if ((!limit || limit < 1 || limit > 10000) || (!pollingDuration || pollingDuration < 1000)) {
            throw new Error('Limit should be between 1 and 10000, and polling duration should be greater than or Equals to 1000');
        }
        // check credentials and region and streamName
        if (!credentials || !region || !streamName) {
            throw new Error('Please provide credentials, region and streamName');
        }
        try {
            const client = new KinesisClient({
                region: region,
                credentials: credentials
            });

            const listShardsCommand = new ListShardsCommand({ StreamName: streamName });
            const shardsResult = await client.send(listShardsCommand);

            for (const shard of shardsResult.Shards) {
                const shardParams = {
                    ShardId: shard.ShardId,
                    ShardIteratorType: shardIteratorType,
                    StreamName: streamName,
                };

                const getShardIteratorCommand = new GetShardIteratorCommand(shardParams);
                const shardIterator = await client.send(getShardIteratorCommand);

                const getRecords = async (iterator, delay = 1000) => {
                    const getRecordsParams = {
                        ShardIterator: iterator,
                        Limit: limit
                    };

                    const getRecordsCommand = new GetRecordsCommand(getRecordsParams);
                    const result = await client.send(getRecordsCommand);

                    if (result.Records.length > 0) {
                        this.processRecords(result.Records);
                    }

                    setTimeout(async () => await getRecords(result.NextShardIterator, pollingDuration * 2), pollingDuration);
                };

                getRecords(shardIterator.ShardIterator);
            }

        } catch (error) {
            // emit error
            this.emit('error', error);
        }

    }
    processRecords(records) {
        records.forEach((record) => {
            const payload = JSON.parse(Buffer.from(record.Data, 'base64').toString('utf-8'));
            this.emit('data', payload);
        });
    }
}

// export default startConsumer;

module.exports = KinesisConsumer;
