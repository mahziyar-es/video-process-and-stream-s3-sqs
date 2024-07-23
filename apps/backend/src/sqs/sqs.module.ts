import { Module } from '@nestjs/common';
import { sqsClientProvider } from './sqs-client.provider';
import { SQSService } from './sqs.service';

@Module({
  imports: [],
  providers: [sqsClientProvider, SQSService],
  exports: [SQSService],
})
export class SQSModule {}
