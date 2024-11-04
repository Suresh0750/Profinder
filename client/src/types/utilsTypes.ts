


// * params


export type ForgetPasswordPage  = {
    getCustomer : string
}


export type GoogleLoginCredentials = {
    username : string,
    EmailAddress : string,
    role : string,
}

export type GoogleWorkerCredentials = {
    FirstName : string,
    LastName : string,
    PhoneNumber? : number,
    EmailAddress : string,
    Password? : string,
    Profile : string,
    Category ?: string,
    Country? : string,
    StreetAddress? : string,
    State? : string,
    City? : string,
    Apt ?: string,
    Identity ?: string,
    PostalCode?: number
}


// * Google Maps for emergency

export interface CoordsTypes  {
    latitude : number,
    longitude : number
}

export  type workerDetailsWithlatlon= GoogleWorkerCredentials&{
    latitude ? :number,
    longitude ? : number,
    isWorker? : boolean
  }



export type Tree = {
    _id: string;
    key: string;
    name: string;
    lat: number;
    lng: number;
  };


// * here we denote point which is render the worker mark
export type Point = {
            _id: string;
            FirstName: string;
            latitude: number;
            longitude: number;
            key: string;
        };
 

export type IUser = {
    FirstName :string,
}



export type readMsgType = {
    _id:string,
    message: string;
    userId: any;
    workerId: any
}


export interface newMessage {
    _id: string;
    message : string;
    creatAt : string,
    updateAt : string,
    __v : 0,
    conversationId:string,
    isRead : boolean,
    sender :string
  }


// # single worker page 

// * review data

export interface reviewData {
    _id: string,
    comment:string,
    rating: number,
    userId: {
      _id: string,
      username: string,
      profile: string
    },
    workerId: string,
    requestId: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}


