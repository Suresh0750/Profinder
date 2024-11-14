import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCode, CustomerDetails } from '../../../../domain/entities/commonTypes';


// * Extend Express session to include user data
declare module 'express-session' {
    interface SessionData {
        UserData: CustomerDetails;
        WorkerData: CustomerDetails;
        customerId: string;
    }
}

//*  Token renewal function
export const renewToken = async (req: Request, res: Response): Promise<boolean> => {
    try {

            const refreshToken = req.cookies.userToken;
            
            if (!refreshToken) {
                // console.log(`step invalid`)
                return false; // No refresh token present
            }
    
            let userRefreshTokenData;
            
            try {
                // console.log('step6')
                userRefreshTokenData = jwt.verify(refreshToken, String(process.env.REFRESH_TOKEN_SECRET));
            } catch (error) {
                console.error('Invalid refresh token:', error);
                return false; // Invalid refresh token
            }
    
            const { customerId, customerName, customerEmail, role } = userRefreshTokenData as CustomerDetails;
            // console.log('step7')
            // Generate new access token
            const accessToken = jwt.sign(
                { customerId, customerName, customerEmail, role },
                String(process.env.ACCESS_TOKEN_SECRET),
                { expiresIn: '15m' }
            );
                    // Set new access token in cookies
                    res.cookie('accessToken', accessToken, { maxAge: 2 * 60 * 1000 });
       return true

    } catch (error) {
        console.error(error);
        return false; // An error occurred during renewal
    }
};