import { Message } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { VideosService } from 'src/videos/videos.service';

@Injectable()
export class SQSConsumerService {
  constructor(private readonly videosService: VideosService) {}

  @SqsMessageHandler('general_consumer', false)
  public async handleMessage(message: Message) {
    const body = JSON.parse(message.Body);

    Logger.log(`New message consumed from SQS : ${body.action}`);

    if (!body.action) return;

    if (body.action === 'start_video_process' && body.video_key) {
      this.videosService.process(body.video_key);
    }
  }
}
