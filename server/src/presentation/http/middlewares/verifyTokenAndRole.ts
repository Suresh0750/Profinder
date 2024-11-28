import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Role, StatusCode } from '../../../domain/entities/commonTypes';
import { CookieTypes, CustomerDetails } from '../../../domain/entities/commonTypes';
import { Cookie } from 'express-session';
import {checkBlocked} from '../../../app/services/checkBlocked'

declare module 'express-session' {
    interface SessionData {
        UserData: CustomerDetails;
        WorkerData: CustomerDetails;
        customerId: string;
    }
}
type RoleType = 'admin' | 'worker' | 'user';
// *  Helper function to verify JWT token
export function verifyToken(token: string, secretKey: string) {
    try {
        return jwt.verify(token, secretKey) as CustomerDetails;
    } catch (error:any) {
        console.log('verify token', error?.message);
        return null;
    }
}

// * Function to generate a new access token
export const generateAccessToken =  (payload: Object) => {
    try {
        return jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: '15m' });
    } catch (error) {
        console.log(error);
    }
};

// * Middleware to verify access token and role
export const verifyTokenAndRole = (role: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log(role);
            const url = req.originalUrl;
            let payload: CustomerDetails | null = null;
            let accessToken;

 
            if (selectRefreshToken(url, Role.Admin)) {
                accessToken = req.cookies[CookieTypes.AdminAccessToken];
            } else if (selectRefreshToken(url, Role.Worker)) {
                accessToken = req.cookies[CookieTypes.WorkerAccessToken];
            } else if (selectRefreshToken(url, Role.User)) {
                accessToken = req.cookies[CookieTypes.UserAccessToken];
             
            } else {
                accessToken = req.cookies[CookieTypes.UserAccessToken] || req.cookies[CookieTypes.WorkerAccessToken];
            }

            if (accessToken) {
             
                payload = verifyToken(accessToken, String(process.env.ACCESS_TOKEN_SECRET));
                
            }

           

            if (!payload || !accessToken) {
                // console.log('accessToken vanished', accessToken);
                payload = await verifyRefreshToken(req, res); // Await the async function here
            }

            if (!payload) {
                // console.log('no access token and no refreshtoken');
                return res.status(StatusCode.Unauthorized).json({ success: false, message: 'Unauthorized, please log in',middleware:true });
            }

            
            if (payload && (payload?.role == Role.User || payload?.role == Role.Worker)) {
                const isBlock = await checkBlocked(payload?.role, payload?.customerId);
                
                if (isBlock) {
                    await clearToken(payload.role,res)
                    return res
                        .status(StatusCode.Forbidden)
                        .json({ success: false, message: 'account is blocked', isBlock: true,middleware:true  });
                }
            }
            

            req.session.customerId = payload.customerId;
            req.session.save();

            if (!role.includes(payload.role)) {
                // console.log('role checking');
                // console.log(role, payload.role);
                return res.status(StatusCode.Forbidden).json({ success: false, message: 'Access denied',middleware:true });
            }

            next(); // Proceed to the next middleware/handler
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ success: false, message: 'An error occurred' });
        }
    };
};



export const verifyRefreshToken = (req: Request, res: Response): CustomerDetails | null => {
    try {
        const roleAccessToken = {
            admin : CookieTypes.AdminAccessToken ,
            worker : CookieTypes.WorkerAccessToken ,
            user : CookieTypes.UserAccessToken
        }
        const roleRefreshToken = {
            admin : CookieTypes.AdminRefreshToken,
            worker : CookieTypes.WorkerRefreshToken,
            user : CookieTypes.UserRefreshToken
        }
        // # need to check the url
        let refreshToken = null
        let tokenRole: string| null = null
        if(selectRefreshToken(req.originalUrl,Role.Admin)){
            refreshToken =  req.cookies[CookieTypes.AdminRefreshToken];
            tokenRole =Role.Admin
        }else if(selectRefreshToken(req.originalUrl,Role.Worker)){
            refreshToken = req.cookies[CookieTypes.WorkerRefreshToken];
            tokenRole = Role.Worker
        }else if(selectRefreshToken(req.originalUrl,Role.User)){
            refreshToken = req.cookies[CookieTypes.UserRefreshToken];
            tokenRole = Role.User
        }else{
            refreshToken = req.cookies[CookieTypes.UserRefreshToken] || req.cookies[CookieTypes.WorkerRefreshToken];
            tokenRole = req.cookies[CookieTypes.UserRefreshToken] ? Role.User : Role.Worker
        }
        if(!refreshToken){
            return null
        }
        // console.log('refreshToken',refreshToken)
        const refreshPayload = verifyToken(refreshToken,String(process.env.REFRESH_TOKEN_SECRET));
        // console.log('refreshPayload',refreshPayload)
        if (refreshPayload) {
            const { exp, ...newPayload } = refreshPayload;
            const newAccessToken =  generateAccessToken(newPayload);
            if (newAccessToken) {
                // console.log('newAccessToken ,',newAccessToken)
                if(tokenRole) res.cookie(roleAccessToken[tokenRole as RoleType],newAccessToken, { maxAge: 15 * 60 * 1000 });
                return newPayload as CustomerDetails;
            }
        }
 
        if (tokenRole as RoleType) {
            res.clearCookie(roleRefreshToken[tokenRole as RoleType]);
            res.clearCookie(roleAccessToken[tokenRole as RoleType]);
        }
    } catch (error) {
        console.log('Error from refreshToken', error);
    }
    return null;
};


function selectRefreshToken(url:string,role:string){
   
    return url.includes(role)
}

function clearToken(role: string, res: Response) {
    try {
        switch (role) {
            case Role.User:
                res.clearCookie(CookieTypes.UserRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/',
                });
                res.clearCookie(CookieTypes.UserAccessToken);
                break; 
            case Role.Worker:
                res.clearCookie(CookieTypes.WorkerRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/',
                });
                res.clearCookie(CookieTypes.WorkerAccessToken);
                break; 
            default:
                console.log('Role not handled:', role);
        }
    } catch (error: any) {
        console.error('Error clearing tokens:', error);
    }
}
