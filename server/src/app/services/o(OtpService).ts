import { sendEmail } from "../../infrastructure/service/e(EmailService)/nodemailer";

function generateOtp() {
  return Math.floor(1000 + Math.random() * 1000);
}

export const OtpService = async (customerId: any, EmailAddress: string) => {
  try {
    // console.log(`Otp service`);
    const customerOTP = generateOtp(); // * call to generate the OTP
    await sendEmail(EmailAddress, customerOTP); // * call nodemailer for sent otp to user
    return { customerOTP, customerId };
  } catch (error) {
    throw error
  }
};
