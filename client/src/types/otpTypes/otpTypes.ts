

export type OTPData = Record<string,string>





// * OTP with setPassword Page validation Handle data types


export interface FormData {
    otpValue: string;
    newPass: string;
    confirmPass: string;
  }
  
export interface ErrorState {
    otpValue: string;
    newPass: string;
    confirmPass: string;
  }