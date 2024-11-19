import { Schema, model } from 'mongoose';
import { ReviewTypes } from '../../../../domain/entities/commonTypes';

// Review Schema
const ReviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    requestId: { type: Schema.Types.ObjectId, ref: 'Request', required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export const ReviewModel = model<ReviewTypes>('Review', ReviewSchema, 'reviews');
