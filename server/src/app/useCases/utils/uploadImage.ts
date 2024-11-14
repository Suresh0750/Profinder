

import {uploadToS3Bucket} from '../../../infrastructure/service/uploadToS3Bucket'
import {IMulterFile} from"../../../domain/entities/admin"

export const uploadImage = async (file:IMulterFile)=>{
    try {
        // console.log(`req reached uploadImage useCases `)
       return await uploadToS3Bucket(file) // * upload image to s3 Bucket
    } catch (error) {
        console.log(`Error from useCases->utils->uploadImage \n${error}`)
        throw error
    }
}