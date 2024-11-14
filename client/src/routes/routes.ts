
const changeToHomeRoutes = new Set(["/user/login","/user/userOtp/", "/user/signup","/worker/login","/worker/signup"]);



export function isUserProtectedRoute (pathname: string): boolean{
    // console.log('request router')
    // console.log(pathname)
    
    return changeToHomeRoutes.has(pathname) ;
}
export function isWorkerProtectedRoute (pathname: string): boolean{
    // console.log('request router')
    // console.log(pathname)
    return changeToHomeRoutes.has(pathname);
}
    
