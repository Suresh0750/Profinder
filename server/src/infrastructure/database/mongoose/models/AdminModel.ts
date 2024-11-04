import {Schema,model,Document} from 'mongoose'

// * types
import { AddCategory } from '../../../../domain/entities/Admin';




// * Schema
const categorySchema = new Schema({
    categoryName : String,
    categoryDescription : String,
    categoryImage : String,
    isListed :{
        type :Boolean,
        default : true
    }
},{ timestamps: true })


export const CategoryModel = model<AddCategory & Document>("CategoryCollection",categorySchema) ;