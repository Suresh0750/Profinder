"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { GoogleOAuthProvider } from '@react-oauth/google';


export const StoreProvider = ({children}:{children:React.ReactNode})=>{
    // console.log(`google ID`,process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    return(
        <Provider store={store}>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                {children}
            </GoogleOAuthProvider>
        </Provider>
    )

}

