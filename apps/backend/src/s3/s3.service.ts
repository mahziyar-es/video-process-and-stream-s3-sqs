import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { S3Buckets } from './s3-buckets.enum';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  constructor(private readonly s3Client: S3Client) {}

  async uploadToBucket(
    bucket: S3Buckets,
    key: string,
    file: string | Uint8Array | Buffer | Readable,
  ) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
      });

      return await this.s3Client.send(command);
    } catch (error: unknown) {
      Logger.error(JSON.stringify(error));
      throw new HttpException(
        'Something went wrong during upload to S3 bucket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getObjectFromBucketWithKey(bucket: S3Buckets, key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      return response.Body;
    } catch (error: unknown) {
      Logger.error(JSON.stringify(error));
      throw new HttpException(
        'Something went wrong during fetching object from S3 bucket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteObjectInBucketWithKey(bucket: S3Buckets, key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      return await this.s3Client.send(command);
    } catch (error: unknown) {
      Logger.error(JSON.stringify(error));
      throw new HttpException(
        'Something went wrong during deleting object from S3 bucket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPresignUrlForObject(bucket: S3Buckets, key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error: unknown) {
      Logger.error(JSON.stringify(error));
      throw new HttpException(
        'Something went wrong during creating s3 presign url for object',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
