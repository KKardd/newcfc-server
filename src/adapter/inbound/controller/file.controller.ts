import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors, Body, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags, ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNotEmpty } from 'class-validator';

import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { FileUploadType } from '@/domain/enum/file-upload-type.enum';
import { FileMetadataService } from '@/port/service/file-metadata.service';

class FileUploadDto {
  @ApiProperty({
    description: '파일 업로드 타입',
    enum: FileUploadType,
    example: FileUploadType.RECEIPT,
  })
  @IsEnum(FileUploadType)
  @IsNotEmpty()
  uploadType: FileUploadType;
}

class FileUploadResponseDto {
  @ApiProperty({
    description: '업로드된 파일들의 URL 목록',
    type: [String],
    example: ['https://example.com/file1.jpg', 'https://example.com/file2.pdf'],
  })
  urls: string[];
}

@ApiTags('File')
@ApiBearerAuth()
@Controller('files')
export class FileController {
  constructor(private readonly fileMetadataService: FileMetadataService) {}

  @ApiOperation({ summary: '파일 업로드 (최대 10개)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: '업로드할 파일들 (최대 10개)',
        },
        uploadType: {
          type: 'string',
          enum: Object.values(FileUploadType),
          description: '파일 업로드 타입',
        },
      },
    },
  })
  @ApiSuccessResponse(201, FileUploadResponseDto)
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadDto: FileUploadDto,
  ): Promise<FileUploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

    if (files.length > 10) {
      throw new BadRequestException('최대 10개의 파일만 업로드할 수 있습니다.');
    }

    const urls: string[] = [];
    for (const file of files) {
      const result = await this.fileMetadataService.upload(uploadDto.uploadType, file);
      urls.push(result.url);
    }

    return { urls };
  }
}
