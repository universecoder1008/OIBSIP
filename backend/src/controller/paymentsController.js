import razorpay from "../utils/razorpay.js";
import crypto from "crypto";



export const createRazorpayOrder = async (req, res) => {

  try {

    

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    

    const order = await razorpay.orders.create(options);

    

    res.status(200).json(order);

  } catch (error) {

   

    res.status(500).json({
      message: error.message
    });

  }

};

export const verifyPayment = async(req,res)=>{
    try {
        
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        const sign = razorpay_order_id+'|'+razorpay_payment_id

        const expectedSign = crypto
        .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex')

        const isAuthentic = expectedSign === razorpay_signature

        if(!isAuthentic){
            return res.status(400).json({
                succes:false,
                message:"Invalid Signature"
            });
        }

        res.status(200).json({
            succes:true,
            message:"Payment Verified"
        });





    } catch (error) {
         return res.status(500).json({
            message:error.message
        })
    }
}