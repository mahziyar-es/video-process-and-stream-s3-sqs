import { Injectable, Logger } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { S3Service } from 'src/s3/s3.service';
import { SQSService } from 'src/sqs/sqs.service';
import { S3Buckets } from 'src/s3/s3-buckets.enum';
import { v4 as uuidv4 } from 'uuid';
import * as ffmpeg from 'fluent-ffmpeg';
import { createReadStream, existsSync } from 'fs';
import { mkdir, readdir, rm } from 'fs/promises';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';
import { DynamoDBTables } from 'src/dynamodb/dynamodb-tables.enum';
import { extname } from 'path';

@Injectable()
export class VideosService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly sqsService: SQSService,
    private readonly dynamodbService: DynamoDBService,
  ) {}

  async create(
    createVideoDto: CreateVideoDto,
    video: Express.Multer.File,
    thumbnail: Express.Multer.File,
  ) {
    const videoKey = uuidv4();

    await this.s3Service.uploadToBucket(
      S3Buckets.RAW_VIDEOS_BUCKET,
      videoKey,
      video.buffer,
    );

    const thumbnailKey = `${videoKey}${extname(thumbnail.originalname)}`;

    await this.s3Service.uploadToBucket(
      S3Buckets.THUMBNAILS_BUCKET,
      thumbnailKey,
      thumbnail.buffer,
    );

    await this.dynamodbService.createItemInTable(DynamoDBTables.VIDEOS, {
      key: videoKey,
      title: createVideoDto.title,
      description: createVideoDto.description,
      video_status: 'pending',
      thumbnail: `${process.env.S3_BUCKETS_BASE_URL}/${S3Buckets.THUMBNAILS_BUCKET}/${thumbnailKey}`,
    });

    await this.sqsService.publish({
      action: 'start_video_process',
      video_key: videoKey,
    });

    return {
      video_key: videoKey,
    };
  }

  async process(videoKey: string) {
    Logger.log(`processing video ${videoKey}`);

    await this.dynamodbService.updateItemInTable(
      DynamoDBTables.VIDEOS,
      { key: videoKey },
      {
        video_status: 'processing',
      },
    );

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

  async uploadProcessedVideoToS3(videoKey: string) {
    Logger.log(`uploading processed video ${videoKey} from local to S3`);

    const processedVideoFolder = `processed-videos/${videoKey}`;

    const files = await readdir(processedVideoFolder);

    try {
      for (const file of files) {
        const readStram = createReadStream(`${processedVideoFolder}/${file}`);

        await this.s3Service.uploadToBucket(
          S3Buckets.PROCESSED_VIDEOS_BUCKET,
          file,
          readStram,
        );
      }

      Logger.log('Successfully uploaded processed video files to S3');

      await this.dynamodbService.updateItemInTable(
        DynamoDBTables.VIDEOS,
        { key: videoKey },
        {
          video_status: 'ready',
        },
      );

      this.sqsService.publish({
        action: 'delete_processed_video_files',
        video_key: videoKey,
      });
    } catch (error: unknown) {
      Logger.error(
        'Something went wrong during the upload of processed video files to S3',
        JSON.stringify(error),
      );
    }
  }

  async deleteProcessedVideoFile(videoKey: string) {
    Logger.log(`deleting processed video ${videoKey} files`);

    const processedVideoFolder = `processed-videos/${videoKey}`;

    try {
      await rm(processedVideoFolder, { recursive: true, force: true });

      Logger.log('Successfully deleted all processed video files from local');

      await this.s3Service.deleteObjectInBucketWithKey(
        S3Buckets.RAW_VIDEOS_BUCKET,
        videoKey,
      );

      Logger.log(
        'Successfully deleted raw file of the processed video from S3',
      );
    } catch (error: unknown) {
      Logger.error(
        'Something went wrong when deleting processed video files',
        JSON.stringify(error),
      );
    }
  }
}
