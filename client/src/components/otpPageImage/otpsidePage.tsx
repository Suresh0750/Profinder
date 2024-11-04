

import Image from "next/image";
import OtpSidePage from "../../../public/images/otpimage/otpsideImage.png"

export default function OtpImage(){
    return(
        <>
            <Image src={OtpSidePage} alt="Otp page Image" />
        </>
    )
}