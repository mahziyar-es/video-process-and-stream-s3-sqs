import { FactoryProvider } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const dynamodbClientProvider: FactoryProvider = {
  provide: DynamoDBClient,
  useFactory: () => {
    const dynamodbClient = new DynamoDBClient({
      endpoint: 'http://localstack:4566',
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
      },
    });

    return DynamoDBDocumentClient.from(dynamodbClient);
  },
};
