
import {Schema,model} from 'mongoose'


// * here use TTL index for delete the document automatically

const OTPModel = new Schema({
    customerId: String,
    OtpPIN: Number,
    otpExpiration: Date,
    createdAt : {
        type : Date,
        default : Date.now,
        // index : {expires:'1m'}
    }
},{ timestamps: true } );

// // Create a TTL index on the otpExpiration field
OTPModel.index({ otpExpiration: 1 }, { expireAfterSeconds: 60 });

const OtpModel = model('Otp', OTPModel,"otps");

export  {OtpModel};
