import mongoose,{Document,Schema} from "mongoose";
import { User } from "../../../../domain/entities/user";


const userSchema = new Schema({
    username: { type: String, required: true,trim:true },
    phoneNumber: { type: Number, required: true },
    emailAddress: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }, // Changed from `isBlock` to `isBlocked`
    profile: { type: String },
}, { timestamps: true });
const UserModel = mongoose.model<User & Document>('User',userSchema,"users")

export {UserModel}