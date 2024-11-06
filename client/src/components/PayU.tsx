import { useEffect, useRef, useState } from "react";
import { usePayU_APIMutation } from "@/lib/features/api/customerApiSlice";
import { FRONTEND_DOMAIN, PayU } from "@/utils/constants";
import { IUser } from "@/types/utilsTypes";
import { generateTxnId } from "@/utils/generateTxnId";

type props = {
  currUserData: IUser;
  requestId: string;
  payment: string;
};

const PayUComponent = ({ currUserData, requestId, payment }: props) => {
  const [hash, setHash] = useState(null);

  const { customerName, _id, customerEmail }: any = currUserData;

  // * API call
  const [payU_API] = usePayU_APIMutation();

  const txnidRef = useRef(generateTxnId(8));
  const txnid = txnidRef.current;
  const amount = parseFloat(String(payment)).toFixed(2); // Ensure correct format
  const productinfo = requestId;
  const firstname = customerName;
  const customerId = _id;
  const key = PayU.merchantKey;
  const phone = "1234567890"; // Ensure this is a string
  const surl = process.env.NEXT_PAYMENT_SUCCESS_URL;
  const furl = process.env.NEXT_PAYMENT_FAILURE_URL;
  const service_provider = "payu_paisa";

  useEffect(() => {
    const data = { txnid, amount, productinfo, firstname, customerEmail, phone };

    (async function (data) {
      try {
        const res = await payU_API(data).unwrap();
        setHash(res.hash);
      } catch (error: any) {
        console.error("Payment Error: " + error.message);
      }
    })(data);
  }, [payU_API, amount, customerEmail, firstname, productinfo, txnid]);

  return (
    <form action="https://test.payu.in/_payment" method="post">
      <input type="hidden" name="key" value={key} />
      <input type="hidden" name="txnid" value={txnid} />
      <input type="hidden" name="productinfo" value={productinfo} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="email" value={customerEmail} />
      <input type="hidden" name="firstname" value={firstname} />
      <input type="hidden" name="_id" value={_id} />
      <input type="hidden" name="surl" value={surl} />
      <input type="hidden" name="furl" value={furl} />
      <input type="hidden" name="phone" value={phone} />
      <input type="hidden" name="hash" value={hash || ""} />
      {hash && (
        <button
          type="submit"
          value="submit"
          className="bg-rootBg bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
        >
          Pay with PayU
        </button>
      )}
    </form>
  );
};

export default PayUComponent;
