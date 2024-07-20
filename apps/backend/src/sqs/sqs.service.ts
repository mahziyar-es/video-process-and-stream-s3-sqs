import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SQSService {
  private queueURL = process.env.SQS_QUEUE_URL;

  constructor(private readonly sqsClient: SQSClient) {}

  async publish(message: string) {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueURL,
        MessageBody: message,
      });

      await this.sqsClient.send(command);

      Logger.log('sent to SQS queue');
    } catch (error: unknown) {
      Logger.log('error sending to SQS:', JSON.stringify(error));

      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
