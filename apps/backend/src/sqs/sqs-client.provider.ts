import { SQSClient } from '@aws-sdk/client-sqs';
import { FactoryProvider } from '@nestjs/common';

export const sqsClientProvider: FactoryProvider = {
  provide: SQSClient,
  useFactory: () => {
    return new SQSClient({
      endpoint: 'http://localstack:4566',
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
      },
    });
  },
};
