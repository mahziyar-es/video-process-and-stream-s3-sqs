import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { S3Module } from 'src/s3/s3.module';
import { SQSModule } from 'src/sqs/sqs.module';
import { DynamoDBModule } from 'src/dynamodb/dynamodb.module';

@Module({
  imports: [S3Module, SQSModule, DynamoDBModule],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
