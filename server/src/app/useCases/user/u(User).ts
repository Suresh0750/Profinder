
import { StatusCode } from "../../../domain/entities/commonTypes";
import { User ,profileTypes,conversationTypes} from "../../../domain/entities/u(User)";
import { IgetUserRepository } from "../../../domain/repositories/I(IUserRepository)";
import { getUserRepository } from "../../../infrastructure/database/mongoose/mur(MongooseUserRepository)";
import { hashPassword } from "../../../shared/utils/encrptionUtils";
import { OtpService } from "../../services/o(OtpService)";
import { OtpStoreData } from "../utils/o(OtpStoreData)";
import { sendMessage } from "../utils/chatUtils";

//672b0a442d110d2355978ef4


export const paymentIdUsecases = async(requestId:string)=>{
  try{
    return await getUserRepository().getPaymentId(requestId)
  }catch(error){
    console.log(`error from usecase in paymentIdUsecases`, error);
    throw error;
  }
}

// * get booking details usecases

export const getBookingUsecases = async(userId:string)=>{
  try{
    const [bookingDetails,reviewDetails] = await Promise.all([
      getUserRepository().getBooking(userId),
      getUserRepository().getReviewID(userId)
    ])
    return {bookingDetails,reviewDetails} 
  }catch(error){
    console.log(`error from usecase in getBookingUsecases`, error);
    throw error;
  }
}

// * user in chat side

export const getMessageUsecases = async(conversationId:string)=>{
  try {
    await getUserRepository().updateIsReadQuery(conversationId)
    return await getUserRepository().fetchMessageQuery(conversationId)
  } catch (error) {
    console.log(`error from usecase in getMessageUsecases`, error);
    throw error;
  }
}

export const getConversationUsecases = async(id:string)=>{
  try {
    return await getUserRepository().fetchConversation(id)
  } catch (error) {
    console.log(`error from usecase in getConversationUsecases`, error);
    throw error;
  }
}


export const conversationUsecases = async(data:conversationTypes)=>{
  try {
    console.log('conversation Usecases')
    console.log(data)
    const checkExist :conversationTypes|null = await getUserRepository().checkConversation(String(data?.userId),String(data?.workerId))
    // console.log('Checkexist')
    // console.log(JSON.stringify(checkExist)) 
    if(checkExist){
      await  getUserRepository().updateConversation(data)
    }else{
         // * user click messge box in single worker details page side here no message
      await getUserRepository().conversationQuery(data)  // * create conversation
    }
    const conversationId = await getUserRepository().findconversationId(String(data?.userId),String(data?.workerId))
    if(data?.lastMessage && conversationId?._id) {
     const result =  await getUserRepository().createMessage({conversationId:conversationId?._id,sender:data?.userId,message:data?.lastMessage})
     console.log(`create the new document`)
     await sendMessage(result)
    }
    
    return 
  } catch (error) {
    console.log(`error from usecase in conversationUsecases`, error);
    throw error;
  }
}

// * profile side
export const EditprofileUsecases = async(data:profileTypes)=>{
  try{
      const {username,email,phone,profile} = data
      const userData = {
        username,
        PhoneNumber:phone,
        EmailAddress : email,
        profile
      }
      return getUserRepository().updateprofile(userData)
  }catch(error){
    console.log(`error from usecase in editprofileUsecases`, error);
    throw error;
  }
}

export const ProfileUsecases = async (_id:string)=>{
  try {
    return getUserRepository().Profile(_id)
  } catch (error) {
    console.log(`error from usecase in ProfileUsecases`, error);
    throw error;
  }
}

export const createUser = async (userData: User) => {
  try {
    
    console.log(`req comes usecase createUser`);
    const {findUserByEmail,insertUserDetails,createUser}: IgetUserRepository = getUserRepository();
    const isExistUser: User | null = await findUserByEmail(
      userData.EmailAddress
    );
    if (isExistUser && isExistUser?.isVerified) {
      throw new Error("Email is already exist");
    }

    const hashPass = await hashPassword(userData.Password); // * here we used to hash the password
    userData.Password = hashPass;
    let _id: string | undefined;
    if (isExistUser && !isExistUser?.isVerified) {
      
      await insertUserDetails(userData);
      userData = isExistUser;
      _id = isExistUser._id;
    } else {
      userData = await createUser(userData); // * we store the data to the database
      _id = userData._id;
    }

    const { customerOTP, customerId } = await OtpService(_id, userData.EmailAddress); // * call the otpService
    console.log(`${customerOTP} -- ${customerId}==>`);
    await OtpStoreData(customerId, customerOTP);
    return customerId;

  } catch (err) {
    console.log(`error from usecase in createUser`, err);
    throw err;
  }
};
