// import {Schema,model,Document} from 'mongoose'

// // * types
// import { AddCategory } from '../../../../domain/entities/admin';




// // * Schema
// const categorySchema = new Schema({
//     categoryName : String,
//     categoryDescription : String,
//     categoryImage : String,
//     isListed :{
//         type :Boolean,
//         default : true
//     }
// },{ timestamps: true })


// export const CategoryModel = model<AddCategory & Document>("CategoryCollection",categorySchema) ;


import { Schema, model, Document } from 'mongoose';

// * Types
import { AddCategory } from '../../../../domain/entities/admin';

// * Schema
const categorySchema = new Schema({
    categoryName: { type: String, required: true, trim: true, maxlength: 100 },
    categoryDescription: { type: String, trim: true },
    categoryImage: { type: String },
    isListed: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const CategoryModel = model<AddCategory & Document>(
    "Category",  
    categorySchema,
    "categories" 
);
