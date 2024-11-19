import jwt from 'jsonwebtoken'


export const generateOtpAccessToken = async(customerId:string):Promise<string>=>{
    try {
        const secret = process.env.token!

        if(!secret){
            throw new Error("JWT_SECRET is not defined in environment variables.")
        }

        const payload = {customerId}
        const options = {expiresIn:'15m'}
        return jwt.sign(payload, secret, options);
    } catch (error:any) {
        console.error("Error generating OTP token:", error.message);
        throw new Error("Failed to generate OTP token. Please try again.");
    }
}