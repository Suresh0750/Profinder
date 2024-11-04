

import {NextRequest,NextResponse} from 'next/server'
import { jwtVerify } from "jose";
import { isUserProtectedRoute } from './routes/routes';
import { cookies } from 'next/headers';

export async function middleware(req:NextRequest){
  // const isAuthenticated = req.cookies.get('isAuthenticated')
  // console.log('isAuthenticated',isAuthenticated)
    const cookieStore = cookies();
    const pathname = req.nextUrl.pathname;
    // console.log(pathname)
  // Improved matcher for static assets
  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // /user/profile
  
  const workerVerifyToken = await verifyToken("workerToken",req)
  const userVerifyToken = await verifyToken("userToken",req)

  // if (req.nextUrl.pathname.startsWith('/worker/professionalInfo') && (!isAuthenticated || isAuthenticated.value !== 'true')) {
  //   return NextResponse.redirect(new URL('/worker/signup', req.url))
  // }
  // if (req.nextUrl.pathname.startsWith('/worker/workerOtp') && (!isAuthenticated || isAuthenticated.value !== 'true')) {
  //   return NextResponse.redirect(new URL('/worker/signup', req.url))
  // }

  // * product admin router
  if(pathname.includes('/admin')){
    const adminVerifyToken = await AdminVerifyToken("adminToken",req)
  if (!adminVerifyToken && pathname!='/admin/login'){
      const loginUrl = new URL("/admin/login",req.url)
      return NextResponse.redirect(loginUrl)
    }else if(adminVerifyToken&& pathname=='/admin/login'){
      const loginUrl = new URL("/admin/dashboard",req.url)
      return NextResponse.redirect(loginUrl)
    }
   
    return NextResponse.next()
  }



  if(req.url=='/'){
    const loginUrl = new URL("/homePage",req.url)
    return NextResponse.redirect(loginUrl)
  }
  if(pathname?.includes('/user') && !pathname?.includes('/user/UserOtp')  && !isUserProtectedRoute(pathname)&&!userVerifyToken){
    console.log('working...............')
    const loginUrl = new URL("/homePage",req.url)
    return NextResponse.redirect(loginUrl)
  }
  if((workerVerifyToken && isUserProtectedRoute(pathname)) || (userVerifyToken && isUserProtectedRoute(pathname)) ){
    console.log('req redirect')
    const loginUrl = new URL("/homePage",req.url)
    return NextResponse.redirect(loginUrl)
  }else if((!workerVerifyToken && !isUserProtectedRoute(pathname) && req.url == '/homePage')||(!workerVerifyToken&& (req.url).includes("/worker/dashboard"))){
    console.log('req redirect')
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
    
    if (!token?.value) {
      return false;
    }
  
    const secret = process.env.REFRESH_TOKEN_SECRET;
    
    if (!secret) {
      console.log("JWT secret not found in env");
      return false;
    }
  
    try {
      const { payload } = await jwtVerify(
        token.value,
        new TextEncoder().encode(secret)
      );
  
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
  
    const secret = process.env.REFRESH_TOKEN_SECRET;
    console.log("secret",secret)
    
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