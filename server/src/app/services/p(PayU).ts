

import { Request, Response } from "express";
// import { PAYU_MERCHANT_KEY, PAYU_SALT } from "../utils/constants";
import {PAYU_MERCHANT_KEY ,PAYU_SALT} from  '../../domain/entities/p(PaymentTypes)'
import {getWorkerRepository} from '../../infrastructure/database/mongoose/mw(MongooseWorkerRepository)'

import axios from "axios";

var jsSHA = require("jssha");

export const payment = (paymentData:any)=>{
    try {
        const { txnid, amount, productinfo, firstname, customerEmail } = paymentData;
  
        if (!txnid || !amount || !productinfo || !firstname || !customerEmail) {
          // res.status(400).send();
          const error = new Error('Mandatory fields missing');
          (error as any).statusCode = 502;
          throw error;
        }
        
  
        const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${customerEmail}|||||||||||${PAYU_SALT}`;
  
        const sha = new jsSHA("SHA-512", "TEXT");
        sha.update(hashString);
        const hash = sha.getHash("HEX");
        // console.log('hash')
        // console.log(hash)
        return { hash: hash }
      } catch (error) {
        console.log("error payment:", error);
        throw error
      }
    }

    export const IsActivityUsecases = async(data:any)=>{
        try {
           
           
            const res = await getWorkerRepository().IsActivityQuery(data.productinfo,data.mihpayid)
            await getWorkerRepository().paymentData(data?.productinfo,Math.floor(Number(data?.amount)),Number(data?.mihpayid))
            // console.log('after update')
           
             return
        } catch (error) {
            console.log("error payment:", error);
            throw error 
        }
    }
