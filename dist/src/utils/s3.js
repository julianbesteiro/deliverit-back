"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToS3 = void 0;
const customErrors_1 = require("@/errors/customErrors");
const client_s3_1 = require("@aws-sdk/client-s3");
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const publicKey = process.env.AWS_PUBLIC_KEY;
const secretKey = process.env.AWS_SECRET_KEY;
const s3 = new client_s3_1.S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: publicKey,
        secretAccessKey: secretKey,
    },
});
const uploadImageToS3 = (userId, buffer, contentType) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = `profile-images/${userId}.jpeg`;
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
    };
    try {
        yield s3.send(new client_s3_1.PutObjectCommand(params));
        const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
        return url;
    }
    catch (error) {
        console.log('Error uploading to S3', error);
        throw new customErrors_1.S3UploadError('Error uploading file');
    }
});
exports.uploadImageToS3 = uploadImageToS3;
