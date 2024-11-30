

import {NextRequest,NextResponse} from 'next/server'
import { jwtVerify } from "jose";
import { isUserProtectedRoute, productOtp } from './routes/routes';
import { cookies } from 'next/headers';
import {REFRESH_TOKEN_SECRET} from '@/lib/server/environment'



export async function middleware(req:NextRequest){

    const cookieStore = cookies();
    const pathname = req.nextUrl.pathname;
  console.log(pathname)
  // Improved matcher for static assets
  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // /user/profile
  
  const workerVerifyToken = await verifyToken("workerRefreshToken",req)
  const userVerifyToken = await verifyToken("userRefreshToken",req)
  

  console.log('userRefreshToken',userVerifyToken)
  console.log('workerVerifyToken',workerVerifyToken)

  // * product admin router
  if(pathname.includes('/admin')){
    const adminVerifyToken = await AdminVerifyToken("adminRefreshToken",req)
  if (!adminVerifyToken && pathname!='/admin/login'){
      const loginUrl = new URL("/admin/login",req.url)
      return NextResponse.redirect(loginUrl)
    }else if(adminVerifyToken&& pathname=='/admin/login'){
      const loginUrl = new URL("/admin/dashboard",req.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }


  const homePage = req.nextUrl.pathname
  
  if(homePage==='/'){
    
    const loginUrl = new URL("/homePage",req.url)
    return NextResponse.redirect(loginUrl)
  }

  
  // * product user otp page
  if(pathname.includes('/user/userOtp')){
    let isProduct = await productOtp(req)
    console.log('otp page')
    console.log(isProduct)
    if(!isProduct){
      const loginUrl = new URL('/homePage',req.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next() 
  }

  // * product worker otp page
  if(pathname.includes('/worker/workerOtp')){
    let isProduct = await productOtp(req)
    console.log('otp page')
    console.log(isProduct)
    if(workerVerifyToken){
      const loginUrl = new URL('/homePage',req.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next() 
  }


  
  if(pathname?.includes('/user') && !pathname?.includes('/user/userOtp') && !pathname?.includes('/customer/setforget_password') && !pathname?.includes("/customer/forgetpassword") && !isUserProtectedRoute(pathname)&&!userVerifyToken){
    console.log('homePage 1')
    const loginUrl = new URL("/homePage",req.url)
    return NextResponse.redirect(loginUrl)
  }
  if((workerVerifyToken && isUserProtectedRoute(pathname)) || (userVerifyToken && isUserProtectedRoute(pathname)) ){
    console.log('homePage 2')
    const loginUrl = new URL("/homePage",req.url)
    return NextResponse.redirect(loginUrl)
  }else if((!workerVerifyToken && !isUserProtectedRoute(pathname) && req.url == '/homePage')||(!workerVerifyToken&& (req.url).includes("/worker/dashboard"))){
    console.log('homePage 3')
    const loginUrl = new URL("/homePage",req.url)
    return NextResponse.redirect(loginUrl)
  }


    return NextResponse.next() 
}


// * using for split the URL
export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
  };


async function verifyToken(
    workerToken: string,
    req: NextRequest
  ){
    
    const token = req.cookies.get(workerToken);
    console.log('token')
    console.log(token)
    console.log('access js')
    // console.log(document.cookie)
    if (!token?.value) {
      // console.log('step 1 if')
      return false;
    }
  
    const secret = REFRESH_TOKEN_SECRET;
    
    if (!secret) {
     
      return false;
    }
  
    try {
      const { payload } = await jwtVerify(
        token.value,
        new TextEncoder().encode(secret)
      );
      console.log('payload',payload)
      console.log('Boolean(payload)',Boolean(payload))
      return Boolean(payload);
    } catch (err: any) {
      console.log(`failed to verify ${workerToken}`, err.message);
      return false;
    }
}


async function AdminVerifyToken(AdminToken:string,req:NextRequest){
  const token = req.cookies.get(AdminToken);
    
    if (!token?.value) {
      return false;
    }
  
    const secret = REFRESH_TOKEN_SECRET;
    
    
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
      console.log(`failed to verify ${AdminToken}`, err.message);
      return false;
    }
}