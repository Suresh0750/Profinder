
import {IMulterFile} from "../entities/admin"


export interface S3bucket{
    uploadToS3Bucket(file:IMulterFile) :Promise<string>
}