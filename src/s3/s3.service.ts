import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private s3Region: string;
  private s3BucketName: string;

  constructor(private readonly configService: ConfigService) {
    // Retrieve values from ConfigService and assign directly to local variables
    const region = this.configService.get<string>('AWS_BUCKET_REGION');
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_KEY');

    // Validate that critical configurations are available
    if (!region || !bucketName || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'AWS credentials or bucket region/name are not properly configured.',
      );
    }

    // Assign to class-level properties AFTER validation
    this.s3Region = region;
    this.s3BucketName = bucketName;

    // Initialize S3 client
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  // Method to upload a file to S3
  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const fileKey = `${path}/${uuidv4()}-${file.originalname}`;

    const uploadParams = {
      Bucket: this.s3BucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);

    return `https://${this.s3BucketName}.s3.${this.s3Region}.amazonaws.com/${fileKey}`;
  }

  // Method to get a file from S3
  async getFile(key: string): Promise<Readable> {
    const getParams = {
      Bucket: this.s3BucketName,
      Key: key,
    };

    const command = new GetObjectCommand(getParams);
    const response = await this.s3Client.send(command);

    if (!response.Body) throw new Error('File not found');
    return response.Body as Readable;
  }

  // Method to delete a file from S3
  async deleteFile(key: string): Promise<void> {
    const deleteParams = {
      Bucket: this.s3BucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await this.s3Client.send(command);
  }

  // Method to list files in a specific S3 bucket
  async listFiles(prefix?: string): Promise<string[]> {
    const listParams = {
      Bucket: this.s3BucketName,
      Prefix: prefix,
    };

    const command = new ListObjectsV2Command(listParams);
    const response = await this.s3Client.send(command);

    return (
      response.Contents?.map((item) => item.Key || '').filter((key) => key) ||
      []
    );
  }
}
