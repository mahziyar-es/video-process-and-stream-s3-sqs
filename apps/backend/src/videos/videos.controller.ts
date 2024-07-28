import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideosService } from './videos.service';
import { MultiFileValidatorPipe } from './multi-file-validator.pipe';

@Controller('/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  async findAll() {
    return this.videosService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFiles(
      new MultiFileValidatorPipe({
        video: {
          required: true,
          mimetype: ['video/mp4'],
        },
        thumbnail: {
          required: true,
          mimetype: ['image/jpg', 'image/png', 'image/jpeg'],
        },
      }),
    )
    files: {
      video: Express.Multer.File[];
      thumbnail: Express.Multer.File[];
    },
  ) {
    return this.videosService.create(
      createVideoDto,
      files.video[0],
      files.thumbnail[0],
    );
  }
}
