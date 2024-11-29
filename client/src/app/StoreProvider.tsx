"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { GoogleOAuthProvider } from '@react-oauth/google';
import {GOOGLE_CLIENT_ID} from '@/lib/server/environment'

export const StoreProvider = ({children}:{children:React.ReactNode})=>{
    // console.log(`google ID`,process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    return(
        <Provider store={store}>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
                {children}
            </GoogleOAuthProvider>
        </Provider>
    )

}