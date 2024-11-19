import { Schema, model, Types } from 'mongoose';

// Recent Activity Schema
const RecentActivitySchema = new Schema(
  {
    requestId: { type: Types.ObjectId, ref: 'Request', required: true },  
    workerId: { type: Types.ObjectId, ref: 'Worker', required: true },    
    userId: { type: Types.ObjectId, ref: 'User', required: true },        
    isCompleted: { type: Boolean, default: false },                        
    status: { type: String, default: 'Pending' },                          
    paymentId: { type: Number, default: null },                         
    payment: { type: Number, default: 0 },                                 
  },
  { timestamps: true }  
);

export const RecentActivityModel = model('RecentActivity', RecentActivitySchema, 'recentactivities');
