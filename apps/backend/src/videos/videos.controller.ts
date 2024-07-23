import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideosService } from './videos.service';

@Controller('/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.videosService.create(createVideoDto, video);
  }
}
