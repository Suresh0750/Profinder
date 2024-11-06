// import adsService from "@/utils/apiCalls/adsService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import axios from 'axios';
import { useSavePaymentIdMutation } from "@/lib/features/api/customerApiSlice"; 
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";

export async function POST(req: any, res: NextApiResponse) {
    // const [savePaymentId] = useSavePaymentIdMutation()
    console.log('payment success page\n')
  const contentType = req.headers.get("content-type") || "";
  console.log({ contentType });

  const formData = await req.formData();

  const data: { [key: string]: any } = {};
  formData.forEach((value: any, key: string) => {
    data[key] = value;
  });
  console.log(data)
  console.log('access env')
  console.log(process.env.NEXT_PAYMENTID_URL)
  const PAYMENT_URL :string = process.env.NEXT_PAYMENTID_URL || ''
  console.log('payment url')
console.log(PAYMENT_URL)
  try {
    if(PAYMENT_URL){
      const PayUOrderId = await axios.post(PAYMENT_URL,data, { withCredentials: true })
      console.log('payment id')
      console.log(PayUOrderId)
    }
    
   
  } catch (error: any) {
    console.log(error.message);
  }
  redirect( 
    `/PaymentSuccess/${data?.productinfo}`
  );
}
