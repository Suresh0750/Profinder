

import { Schema, model } from 'mongoose';

const RequestSchema = new Schema(
    {
        service: { type: String, required: true },
        worker: { type: String, required: true },
        user: { type: String, required: true },
        preferredDate: { type: String, required: true }, 
        preferredTime: { type: String, required: true },
        serviceLocation: { type: String, required: true }, 
        additionalNotes: { type: String,required:true,trim:true }, 
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        workerId: {
            type: Schema.Types.ObjectId,
            ref: 'Worker', 
            required: true,
        },
        isAccept: {
            type: String,
            enum: ['Pending', 'Accepted', 'Cancelled','Completed'], 
            default: 'Pending',
        },
        payment: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const RequestModel = model('Request', RequestSchema, 'requests'); 


