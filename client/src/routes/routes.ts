
import {NextRequest} from 'next/server'
import { jwtVerify } from "jose";
import { cookies } from 'next/headers';
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
    

// * otp page product
export async function productOtp(req:NextRequest){
    const token = req.cookies.get('token')
    console.log('otp token')

    if (!token?.value) {
        return false;
    }

    const secret = process.env.NEXT_PUBLIC_TOKEN

    if (!secret) {
        console.log("JWT secret not found in env");
        return false;
    }
  
    try {
        const { payload } = await jwtVerify(
          token.value,
          new TextEncoder().encode(secret)
        );
    
        if (payload) {
          console.log(payload);
          
        } else {
        }
        return Boolean(payload);
      } catch (err: any) {
        console.log(`failed to verify otp token`, err.message);
        return false;
      }
      
}