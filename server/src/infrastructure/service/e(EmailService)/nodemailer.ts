


import {createTransport} from 'nodemailer'

export const sendEmail = async (emailId:string,otp:number):Promise<void>=>{
   
    try {
        console.log(`sendEmail controller`,emailId,otp)
        const transporter = createTransport({
            service : 'Gmail',
            auth :{
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS
            }
        })
        
        const mailOptions = {
            from: "suresh007inr@gmail.com",
            to: emailId,
            subject: "OTP Verification",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="font-size: 24px; color: #333;">Your OTP Verification</h2>
                    <p style="font-size: 16px; color: #555;">Please use the following OTP to verify your account:</p>
                    <h2 style="font-size: 28px; color: #4CAF50;">${otp}</h2>
                    <p style="font-size: 14px; color: #777;">This OTP is valid for 1 minutes. Please do not share it with anyone.</p>
                </div>
                `
          };
        await transporter.sendMail(mailOptions)

       
    } catch (error) {
    //    console.log(`sendEmail nodemail err\n`,error);
        throw error
    }
}