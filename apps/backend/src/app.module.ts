import { Module } from '@nestjs/common';
import { VideosModule } from './videos/videos.module';
import { SQSConsumerModule } from './sqs-consumer/sqs-consumer.module';

@Module({
  imports: [VideosModule, SQSConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
