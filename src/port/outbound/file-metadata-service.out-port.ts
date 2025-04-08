import { FileUploadType } from '@/domain/enum/file-upload-type.enum';

export abstract class FileMetadataServiceOutPort {
  abstract upload(
    uploadType: FileUploadType,
    serialNumber: number,
    file: Express.Multer.File,
  ): Promise<{ url: string; mimeType: string; fileSize: number }>;
}
