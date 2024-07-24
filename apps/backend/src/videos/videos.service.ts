import { Injectable, Logger } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { S3Service } from 'src/s3/s3.service';
import { SQSService } from 'src/sqs/sqs.service';
import { S3Buckets } from 'src/s3/s3-buckets.enum';
import { v4 as uuidv4 } from 'uuid';
import * as ffmpeg from 'fluent-ffmpeg';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

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
    Logger.log(`processing video ${videoKey}`);

    const videoPresignUrl = await this.s3Service.getPresignUrlForObject(
      S3Buckets.RAW_VIDEOS_BUCKET,
      videoKey,
    );

    const outputFolder = `processed-videos/${videoKey}`;

    const outputFilename = `${outputFolder}/${videoKey}.m3u8`;

    if (!existsSync(outputFolder)) {
      await mkdir(outputFolder);
    }

    try {
      await this.convertVideoToHls(videoPresignUrl, outputFilename);

      Logger.log('Successfully convereted video to HLS');

      this.sqsService.publish({
        action: 'upload_processed_video_to_s3',
        video_key: videoKey,
      });
    } catch (error: unknown) {
      Logger.error(
        'Something went wrong during video conversion',
        JSON.stringify(error),
      );
    }
  }

  private async convertVideoToHls(
    inputVideoPath: string,
    outputVideoPath: string,
  ) {
    const { resolution, videoBitrate, audioBitrate } = {
      resolution: '320x180',
      videoBitrate: '500k',
      audioBitrate: '64k',
    };

    await new Promise((resolve, reject) => {
      ffmpeg(inputVideoPath)
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
        .output(outputVideoPath)
        .on('end', () => resolve(true))
        .on('error', (err) => reject(err))
        .run();
    });
  }
}
