import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { S3Service } from 'src/s3/s3.service';
import { SQSService } from 'src/sqs/sqs.service';
import { S3Buckets } from 'src/s3/s3-buckets.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VideosService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly sqsService: SQSService,
  ) {}

  async create(createVideoDto: CreateVideoDto, video: Express.Multer.File) {
    const videoKey = uuidv4();

    await this.s3Service.uploadToBucket(
      S3Buckets.RAW_VIDEOS_BUCKET,
      videoKey,
      video.buffer,
    );

    await this.sqsService.publish({
      action: 'start_video_process',
      video_key: videoKey,
    });
  }

  private async process(videoKey: string) {
    const video = await this.s3Service.getObjectFromBucketWithKey(
      S3Buckets.RAW_VIDEOS_BUCKET,
      videoKey,
    );
    console.log(`processing video ${videoKey}`, video.transformToByteArray());
  }
}
