
  export interface FormValues{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    profileImage?: FileList | string;
  };


  export interface WorkerDatails {
    _id?: string,
    firstName :string,
    lastName : string,
    phoneNumber : number,
    emailAddress :string,
    password : string,
    profile : string,
    category : string,
    country : string,
    streetAddress : string,
    state : string,
    city : string,
    apt : string,
    identity : string,
    postalCode : string,
    isWorker ?: boolean ,
    workerImage? : string[],
    reviews ? : string[],
    isVerified : boolean,
    latitude ? : number,
    longitude ? : number,
    createdAt? : string,
    updatedAt ? : string,
    isBlock? :boolean,
    __v ? : number
  }


export interface MaterialCarouselProps {
              images: [
                {
                  projectName: string,
                  ProjectDescription:string,
                  projectImage: string,
                  _id: string
                }
              ];
            }


export interface conversationData {
        _id : string,
        userId : {
          _id : string,
          username:string,
          profile :string
        },
        workerId :string,
        lastMessage:string,
        createdAt? :Date | string,
        updatedAt?:Date | string
      }
            


// * upcoming workers

export interface upcomingWorkerData  {
  _id:string,
 requestId :{
    _id: string,
    preferredTime : string,
    servicelocation : string,
    AdditionalNotes : string,
    payment : number,
    preferredDate : string
},
  workerId :string,
  userId : {
      _id : string,
      username : string,
      PhoneNumber : number,
      EmailAddress : string,
      Address : string,
      
  },
  isCompleted: boolean,
  status : string,
  payment : number,
  paymentId : string,
  createdAt : string,
  updatedAt : string,
  __v : number
}


// * worker dashboard

export interface ImageData {
  projectDescription: string; 
  projectImage: string;
  projectName: number;
}