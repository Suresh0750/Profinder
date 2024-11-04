
export interface OtpRepository {
    createOTP(customerId: string, OtpPIN: number, otpExpiration: Date): Promise<void>;
    CustomerVerifyOTP(otpValue: number, userId: string): Promise<boolean | undefined>;
    verifyUser(userId:string) : Promise<void>;
    verifyWorker(userId:string) : Promise<void>;
    getUserDataResendOTP(customerId:string) : Promise<string | undefined>;
    getWorkerDataResendOTP(customerId:string) : Promise<string | undefined>;
    deleteOTP(customerId:string) :Promise<void>;  
}
