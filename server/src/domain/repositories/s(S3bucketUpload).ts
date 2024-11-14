
import {IMulterFile} from "../entities/a(Admin)"


export interface S3bucket{
    uploadToS3Bucket(file:IMulterFile) :Promise<string>
}