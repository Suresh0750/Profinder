
import { cookies } from 'next/headers'


export const RefreshToken = ()=>{
    const cookieStore = cookies()
    console.log(`Request reached RefreshToken`)

    console.log(cookieStore)
}