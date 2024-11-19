import { Document, model, Schema, Types } from 'mongoose';
import { WorkerInformation } from '../../../../domain/entities/worker';

// Worker Schema
const workerSchema = new Schema<WorkerInformation & Document>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: String, default: "" },
    category: { type: String, required: true },
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    apt: { type: String, default: "" },
    identity: { type: String, required: true },
    postalCode: { type: String, required: true },
    workerImage: [
      {
        projectName: { type: String, required: true },
        projectDescription: { type: String, required: true },
        projectImage: { type: String, required: true },
      },
    ],
    experience: { type: String },
    availability: { type: String },
    rate: { type: Number },
    isVerified: { type: Boolean, default: false },
    isWorker: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const WorkerModel = model<WorkerInformation & Document>('Worker', workerSchema, 'workers'); 

export { WorkerModel };
