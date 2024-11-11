// import adsService from "@/utils/apiCalls/adsService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import axios from 'axios';
import { useSavePaymentIdMutation } from "@/lib/features/api/customerApiSlice"; 
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";

export async function POST(req: any, res: NextApiResponse) {
    // const [savePaymentId] = useSavePaymentIdMutation()
 
  const contentType = req.headers.get("content-type") || "";

  const formData = await req.formData();

  const data: { [key: string]: any } = {};
  formData.forEach((value: any, key: string) => {
    data[key] = value;
  });
  
  const PAYMENT_URL :string = process.env.NEXT_PUBLIC_PAYMENTID_URL || ''
 
  try {
    if(PAYMENT_URL){
      const PayUOrderId = await axios.post(PAYMENT_URL,data, { withCredentials: true })
     
    }
    
   
  } catch (error: any) {
    console.log(error.message);
  }
  redirect( 
    `/PaymentSuccess/${data?.productinfo}`
  );
}
