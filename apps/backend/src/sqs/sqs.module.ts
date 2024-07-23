import { Module } from '@nestjs/common';
import { sqsClientProvider } from './sqs-client.provider';
import { SQSService } from './sqs.service';
import { SqsModule } from '@ssut/nestjs-sqs';

@Module({
  imports: [
    SqsModule.registerAsync({
      useFactory: () => {
        return {
          consumers: [
            {
              queueUrl: process.env.SQS_QUEUE_URL,
              name: 'general_consumer',
              batchSize: 1,
              pollingWaitTimeMs: 10000,
              sqs: sqsClientProvider.useFactory(),
            },
          ],
          producers: [],
        };
      },
    }),
  ],
  providers: [sqsClientProvider, SQSService],
  exports: [SQSService],
})
export class SQSModule {}
