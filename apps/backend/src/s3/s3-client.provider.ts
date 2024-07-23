import { S3Client } from '@aws-sdk/client-s3';
import { FactoryProvider } from '@nestjs/common';

export const s3ClientProvider: FactoryProvider = {
  provide: S3Client,
  useFactory: () => {
    return new S3Client({
      endpoint: 'http://localstack:4566',
      region: process.env.AWS_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
      },
    });
  },
};
