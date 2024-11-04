// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { useSavePaymentIdMutation } from "@/lib/features/api/customerApiSlice"; 
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";

export async function POST(req: any, res: NextApiResponse) {

// * API calls


  const contentType = req.headers.get("content-type") || "";
  console.log({ contentType });

  const data: { [key: string]: any } = {};

  try {
    const formData = await req.formData();
    formData.forEach((value: any, key: string) => {
      data[key] = value;
    });

    //save to payuorders collection
    // const PayUOrderId = await savePaymentId(data).unwrap()

  } catch (error: any) {
    console.log(error.message);
  }

  redirect(
    `/PaymentFailure`
    // `/post/promote/paymentCompleted/?status=${data.status}&mihpayid=${data.mihpayid}`
  );
}
