import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { S3Service } from 'src/s3/s3.service';
import { SQSService } from 'src/sqs/sqs.service';
import { S3Buckets } from 'src/s3/s3-buckets.enum';
import { v4 as uuidv4 } from 'uuid';
import * as ffmpeg from 'fluent-ffmpeg';

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

  async process(videoKey: string) {
    console.log(`processing video ${videoKey}`);

    const videoPresignUrl = await this.s3Service.getPresignUrlForObject(
      S3Buckets.RAW_VIDEOS_BUCKET,
      videoKey,
    );

    const { resolution, videoBitrate, audioBitrate } = {
      resolution: '320x180',
      videoBitrate: '500k',
      audioBitrate: '64k',
    };

    await new Promise((resolve, reject) => {
      ffmpeg(videoPresignUrl)
        .outputOptions([
          `-c:v h264`,
          `-b:v ${videoBitrate}`,
          `-c:a aac`,
          `-b:a ${audioBitrate}`,
          `-vf scale=${resolution}`,
          `-f hls`,
          `-hls_time 10`,
          `-hls_list_size 0`,
          // `-hls_segment_filename hls/${segmentFileName}`,
        ])
        .output(`hls/${videoKey}.m3u8`)
        .on('end', () => resolve(true))
        .on('error', (err) => reject(err))
        .run();
    });

    console.log('done');
  }
}
