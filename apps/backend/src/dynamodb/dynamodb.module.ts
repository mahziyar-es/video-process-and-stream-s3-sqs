import { Module } from '@nestjs/common';
import { dynamodbClientProvider } from './dynamodb-client.provider';
import { DynamoDBService } from './dynamodb.service';

@Module({
  providers: [dynamodbClientProvider, DynamoDBService],
  exports: [DynamoDBService],
})
export class DynamoDBModule {}
