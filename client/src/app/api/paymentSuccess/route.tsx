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

  try {
    const PayUOrderId = await axios.post('http://localhost:3001/customer/savePaymentId',data, { withCredentials: true })
    
    console.log('payment id')
    console.log(PayUOrderId)
    // const PayUOrderId = await savePaymentId(data).unwrap()
    // await adsService.addTransaction(PayUOrderId, data.email, "success");
  } catch (error: any) {
    console.log(error.message);
  }
  redirect( 
    `/PaymentSuccess/${data?.productinfo}`
  );
}
