import { model, Schema, Types } from 'mongoose';


const paymentSchema = new Schema(
    {
      requestId: { type: Types.ObjectId, ref: 'Request', required: true }, 
      payment: { type: Number, required: true },
      paymentId: { type: Number, required: true, unique: true }, 
    },
    { timestamps: true } 
  );



export const PaymentModel = model('Payment', paymentSchema, 'payments');
