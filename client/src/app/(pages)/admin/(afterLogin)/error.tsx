
'use client'

export default function AfterLoginError({error}:{error:React.ReactNode}){
    return(
        <>
            <h2>This error occur</h2>
            <h2>{error}</h2>
        </>
    )
}