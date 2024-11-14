


import Jwt,{JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
import {RoleType} from '../../domain/entities/commonTypes'


export function JwtService(customerId: string, customerName: string, customerEmail: string, role: RoleType) {
    try {
        const payload = { customerId, customerName, customerEmail, role };

        const refreshToken = Jwt.sign(payload, String(process.env.REFRESH_TOKEN_SECRET), { expiresIn: '7d' });
        const accessToken = Jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: '15m' });

        return { refreshToken, accessToken };

    } catch (err) {
        console.error(`Error generating JWT tokens: ${err}`);
        throw err;
    }
}


export function verifyRefreshToken (token:string){
    try {
        // console.log(token,'verifyRefreshToken')
        return Jwt.verify(token,String(process.env.REFRESH_TOKEN_SECRET))
    } catch (error) {
        console.log(`Error from JWTService token verifyRefreshToken \n${error}`)
        throw error
    }
}

