import { Injectable } from '@nestjs/common';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { Hash } from '@aws-sdk/hash-node';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { parseUrl } from '@aws-sdk/url-parser';
import { formatUrl } from '@aws-sdk/util-format-url';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3Service {
  private readonly baseUrl: string;
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private configSerivce: ConfigService) {
    const region = this.configSerivce.get('aws.region');
    this.bucket = this.configSerivce.get('aws.s3.bucket');

    this.client = new S3Client({ region });
    this.baseUrl = `https://${this.bucket}.s3.ap-northeast-2.amazonaws.com`;
  }

  async deleteObject(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
    } catch (err) {
      console.error(err);
      throw new Error('faild to delete object.');
    }
  }

  genObjectKey(prefix: string, fileName: string) {
    return `${prefix}/${createHash('shake256', {
      outputLength: 8,
    })
      .update(Date.now().toString())
      .digest('hex')}-${fileName.split('.').pop()}`;
  }

  async genSignedUrl({
    key,
    method,
  }: {
    method: 'PUT' | 'GET';
    key;
  }): Promise<string> {
    const s3ObjectUrl = parseUrl(`${this.baseUrl}/${key}`);

    const presigner = new S3RequestPresigner({
      sha256: Hash.bind(null, 'sha256'),
      ...this.configSerivce.get('aws'),
    });

    const url = await presigner.presign(
      new HttpRequest({ ...s3ObjectUrl, method: method }),
    );

    return formatUrl(url);
  }
}
