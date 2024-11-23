

export interface addCategoryType {
    CategoryName :string,
    Description : string,    
    CategoryImage : any
}

export interface EditCategoryType {
    categoryName :string,
    categoryDescription : string,    
    categoryImage : any,
    newImageData : any,
    _id : string,
    newImage : boolean
}


export interface AdminCredentials {
    emailAddress : string,
    password : string
}

export interface showCategory {
    _id : string,
    categoryName : string,
    categoryDescription : string,
    categoryImage : string,
    isListed : string,
    createdAt : string,
    updatedAt :string,
    __v : string
}


export interface salesReport{
    _id : string,
    service : string,
    worker : string,
    user : string,
    preferredDate : string,
    isAccept : string,
    payment : number
}


// # dashboard

// * dashboard header card
export interface  DashboardHeadCard {
                totalRevenue: Array<{
                    _id: string | null;
                    payment: number;
                }>;
                totalReview: number;
                totalWorkers: number;
                avgRating: Array<{
                    _id: string | null;
                    sum: number;
                    count: number;
                }>;
            }

// * overview

export interface workerDataTypes {
    _id?:string,
    trade ? :string
    count : number
}

// * jobStatus

export interface jobStatusTypes{ 
    _id ? :string,
    name ? : string,
    value : number
}


// * revenue
export interface revenueData{
    month:string,
    revenue:number
}

export interface revenueRowdata{
    _id: string,
    requestId: string,
    payment: number,
    paymentId: number,
    createdAt: string,
    updatedAt: string,
    __v: number
}


// * review page in dashboard

export interface reviewDashboardTypes{
    _id: string,
    comment: string,
    rating: number,
    userId: { _id: string, username: string},
    workerId: {
      _id:string,
      FirstName:string,
      Profile: string
    },
    requestId: string,
    createdAt: string,
    updatedAt: string,
    __v: number
  }

  export interface topWorkerTypes{
    id: number,
    name: string,
    trade: string,
    rating: string, 
    jobs: number, 
    earnings: number
    }

    // # verify worker details Page

    export interface workerDetailsTypes {
        _id: string,
        firstName: string,
        lastName: string,
        phoneNumber: number,
        emailAddress: string,
        password: string,
        profile: string,
        category: string,
        country: string,
        streetAddress: string,
        latitude: number,
        longitude: number,
        state: string,
        city: string,
        apt: string,
        identity: string,
        postalCode: string,
        reviews: [],
        isVerified: boolean,
        isWorker: boolean,
        isBlock: boolean,
        workerImage: string[],
        createdAt: string,
        updatedAt: string,
        __v: number
      }