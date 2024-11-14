import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Role, StatusCode } from '../../../domain/entities/commonTypes';
import { CookieTypes, CustomerDetails } from '../../../domain/entities/commonTypes';
import { Cookie } from 'express-session';

declare module 'express-session' {
    interface SessionData {
        UserData: CustomerDetails;
        WorkerData: CustomerDetails;
        customerId: string;
    }
}

// *  Helper function to verify JWT token
export function verifyToken(token: string, secretKey: string) {
    try {
        return jwt.verify(token, secretKey) as CustomerDetails;
    } catch (error) {
        console.log('verify token', error);
        return null;
    }
}

// * Function to generate a new access token
export const generateAccessToken = (payload: Object) => {
    try {
        return jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: '15m' });
    } catch (error) {
        console.log(error);
    }
};

// * Middleware to verify access token and role
export const verifyTokenAndRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let payload: CustomerDetails | null = null;

        const accessToken = req.cookies[CookieTypes.AccessToken];
        if (accessToken) {
            payload = verifyToken(accessToken, String(process.env.ACCESS_TOKEN_SECRET));
        }

        if (!payload || !accessToken) {
            payload = verifyRefreshToken(req, res);
        }

        if (!payload) {
            return res.status(StatusCode.Unauthorized).json({ success: false, message: 'Unauthorized, please log in' });
        }

       
        req.session.customerId = payload.customerId;
        req.session.save();

        // * Check if user role matches the required role
        if (role !== payload.role && role !== req.headers.role) {
            return res.status(StatusCode.Forbidden).json({ success: false, message: 'Access denied' });
        }

        next();
    };
};

export const verifyRefreshToken = (req: Request, res: Response): CustomerDetails | null => {
    try {
        const refreshToken = req.cookies[CookieTypes.User] || req.cookies[CookieTypes.Worker];
        const refreshPayload = verifyToken(refreshToken, String(process.env.REFRESH_TOKEN_SECRET));

        if (refreshPayload) {
            
            const { exp, ...newPayload } = refreshPayload;
            const newAccessToken = generateAccessToken(newPayload);
            if (newAccessToken) {
                res.cookie(CookieTypes.AccessToken, newAccessToken, { maxAge: 15 * 60 * 1000 });
                return newPayload as CustomerDetails;
            }
        }
        // * Clear invalid refresh token if present
        res.clearCookie(CookieTypes.User);
        res.clearCookie(CookieTypes.Worker);
        res.clearCookie(CookieTypes.Admin)
    } catch (error) {
        console.log('Error from refreshToken', error);
    }
    return null;
};
