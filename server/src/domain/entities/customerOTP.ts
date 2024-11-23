

// * OTP Type


export interface CustomerOTP {
    _id?: string;
    customerId: string; 
    otpPin: number; 
    otpExpiration: Date; 
    createdAt?: Date; 
    updatedAt?: Date; 
  }
  

  export interface GetVerifyOTP {
    otpValue: number;
    customerId: string;
    role? : string;
  }
  
  
  export interface ResendOTP {
    customerId?: string; 
    userId?: string; 
    role: string;
  }
  
  // * Forget Password Data
  
  
  export interface ForgetPasswordDataType {
    formData: {
      otpValue: string; 
      newPass: string; 
      confirmPass: string; 
    };
    role: string; 
    customerId: string;
  }
  
  // * Google Login Details
  
 
  export interface GoogleLoginTypes {
    username: string; 
    emailAddress: string; 
    role?: string; 
  }
  