import { S3Client, PutObjectCommand,ObjectCannedACL } from "@aws-sdk/client-s3";
import { IMulterFile,paramsImage } from "../../domain/entities/Admin"; // Adjust the path as necessary


export const uploadToS3Bucket = async (file: IMulterFile) => {
  try {
 
    //* Validate the file object
    if (!Object.keys(file).length) {
      throw new Error("No files uploaded");
    }
 
    //* Create an S3 client instance
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
    });
    //* Prepare the parameters for the S3 upload

    const params :paramsImage = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `uploads/${Date.now()}_${file.originalname}`, 
      Body: file.buffer, // *  File content
      ContentType: file.mimetype, // *  MIME type of the file
      //  ACL: "public-read"
    };
 
    //*  Create and send the PutObjectCommand
    const command = new PutObjectCommand(params);
    const uploadResponse = await s3Client.send(command);

    // Return a success response or URL if needed
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

  } catch (error) {
    // console.error(`Error in infrastructure->service->uploadToS3Bucket \n`, error);
    throw new Error("File upload failed");
  }
};
