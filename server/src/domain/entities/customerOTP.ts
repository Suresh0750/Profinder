

// * otp type

export interface CustomerOTP{
    _id? : string,
    customerId : string,
    OtpPIN : Number,
    otpExpiration : Date,
    createAt ?: Date,
    updateAt ? : Date
}


export interface getVerifyOTP {
    otpValue : number,
    userId : string
}


export interface ResendOTP {
    customerID ? : string
    userId ?:string
    role : string
}




// * forgetPassword Data


export interface forgetPasswordDataType {
    formData :{
        otpValue : string,
        newPass : string,
        confirmPass :string
    },
    role : string,
    customerId: string
}


// * google login details

export interface GoogleLogintypes {
    username : string,
    EmailAddress : string,
    role? : string
}

