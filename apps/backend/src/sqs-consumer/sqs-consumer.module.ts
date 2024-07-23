import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { sqsClientProvider } from 'src/sqs/sqs-client.provider';
import { VideosModule } from 'src/videos/videos.module';
import { SQSConsumerService } from './sqs-consumer.service';

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
    VideosModule,
  ],
  providers: [SQSConsumerService],
  exports: [],
})
export class SQSConsumerModule {}
