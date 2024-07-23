import { Message, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';

@Injectable()
export class SQSService {
  private queueURL = process.env.SQS_QUEUE_URL;

  constructor(private readonly sqsClient: SQSClient) {}

  async publish(messageBody: { action: string; [key: string]: any }) {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueURL,
        MessageBody: JSON.stringify(messageBody),
      });

      await this.sqsClient.send(command);

      Logger.log('sent to SQS queue');
    } catch (error: unknown) {
      Logger.log('error sending to SQS:', JSON.stringify(error));

      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @SqsMessageHandler('general_consumer', false)
  public async handleMessage(message: Message) {
    console.log('catched message', message);
  }
}
