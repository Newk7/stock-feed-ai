import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { env } from "../config/env.js";

const s3ClientConfig: ConstructorParameters<typeof S3Client>[0] = {
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
};

if (env.AWS_ENDPOINT_URL) {
  s3ClientConfig.endpoint = env.AWS_ENDPOINT_URL;
  s3ClientConfig.forcePathStyle = true;
}

const s3Client = new S3Client(s3ClientConfig);

export async function getObjectFromS3(
  key: string,
  bucket?: string
): Promise<any> {
  const command = new GetObjectCommand({
    Bucket: bucket || env.S3_BUCKET,
    Key: key,
  });

  const response = await s3Client.send(command);
  const body = await response.Body?.transformToString();
  if (!body) throw new Error(`Empty response for key: ${key}`);

  return JSON.parse(body);
}

export async function getObjectRaw(
  key: string,
  bucket?: string
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket || env.S3_BUCKET,
    Key: key,
  });

  const response = await s3Client.send(command);
  const body = await response.Body?.transformToString();
  if (!body) throw new Error(`Empty response for key: ${key}`);
  return body;
}

export async function listObjectKeys(
  prefix: string,
  bucket?: string
): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: bucket || env.S3_BUCKET,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  return (response.Contents || []).map((obj) => obj.Key!).filter(Boolean);
}
