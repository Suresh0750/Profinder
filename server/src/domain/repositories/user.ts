
import { User ,EditProfileTypes,ConversationTypes,MessageTypes} from "../entities/user";
import {ServiceRequest,MessageType} from "../entities/commonTypes";


// * Repositories types
export interface IgetUserRepository{
    createUser(user:User):Promise<User>;
    findUserByEmail(email:string): Promise<User |null>;   
    insertUserDetails(user:User):Promise<void>;
    loginVerifyQuery(userEmail:string):Promise<User | null> ;
    ischeckEmail(userEmail:string): Promise<string | undefined> ;
    setNewPassWord(customerId:string,newPass:string) :Promise<void> ;
    getDataFindById(userId:string) : Promise<User | null>
    Profile(_id:string) : Promise<User | null>
    updateprofile({username,phoneNumber,emailAddress,profile}:EditProfileTypes) : Promise<void>
    conversationQuery(data:ConversationTypes):Promise<void>
    fetchConversation(userId: string): Promise<ConversationTypes[] | null>
    checkConversation(userId:string,workerId:string):Promise<ConversationTypes | null>
    updateConversation(data:ConversationTypes) : Promise<void>
    findconversationId(userId:string,workerId:string): Promise<{ _id: string; } | null>
    createMessage(data: MessageType): Promise<MessageType>
    updateIsReadQuery(conversationId:string) :Promise<void>
    fetchMessageQuery(conversationId:string) :Promise<MessageTypes[]>
    getBooking(userId:string) : Promise<ServiceRequest[] | null>
    getPaymentId(requestId:string):Promise<{paymentId:string} | null>
    getReviewID(userId:string):Promise<string[]> 
}