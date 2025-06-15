import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors, Body, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { FileUploadType } from '@/domain/enum/file-upload-type.enum';
import { FileMetadataService } from '@/port/service/file-metadata.service';

class FileUploadDto {
  uploadType: FileUploadType;
  serialNumber: number;
}

class FileUploadResponseDto {
  urls: string[];
}

@ApiTags('File')
@ApiBearerAuth()
@Controller('files')
export class FileController {
  constructor(private readonly fileMetadataService: FileMetadataService) {}

  @ApiOperation({ summary: '파일 업로드 (최대 5개)' })
  @ApiConsumes('multipart/form-data')
  @ApiSuccessResponse(201, FileUploadResponseDto)
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadDto: FileUploadDto,
  ): Promise<FileUploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

    if (files.length > 5) {
      throw new BadRequestException('최대 5개의 파일만 업로드할 수 있습니다.');
    }

    const urls: string[] = [];
    for (const file of files) {
      const result = await this.fileMetadataService.upload(uploadDto.uploadType, uploadDto.serialNumber, file);
      urls.push(result.url);
    }

    return { urls };
  }
}
