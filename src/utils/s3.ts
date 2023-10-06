import { S3UploadError } from '../errors/customErrors';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import currentEnv from '../../config/index';

const bucketName = currentEnv.AWS_BUCKET_NAME!;
const bucketRegion = currentEnv.AWS_BUCKET_REGION!;
const publicKey = currentEnv.AWS_PUBLIC_KEY!;
const secretKey = currentEnv.AWS_SECRET_KEY!;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: publicKey,
    secretAccessKey: secretKey,
  },
});

export const uploadImageToS3 = async (userId: string, buffer: Buffer, contentType: string) => {
  const fileName = `profile-images/${userId}.jpeg`;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  };
  try {
    await s3.send(new PutObjectCommand(params));
    const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
    return url;
  } catch (error) {
    console.log('Error uploading to S3', error);
    throw new S3UploadError('Error uploading file');
  }
};
