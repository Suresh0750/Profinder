
import {IMulterFile} from "../../domain/entities/Admin"


export interface S3bucket{
    uploadToS3Bucket(file:IMulterFile) :Promise<string>
}