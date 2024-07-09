
import axios from 'axios';

const MySecretKey = `Bearer ${process.env.TEST_SECRET}`;
console.log(MySecretKey)

export const initializePayment = async (form) => {
  const options = {
    method: 'POST',
    url: 'https://api.paystack.co/transaction/initialize',
    headers: {
      authorization: MySecretKey,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    },
    data: form,
  };

  const response = await axios(options);
  return response.data;
};

export const verifyPayment = async (ref) => {
  const options = {
    method: 'GET',
    url: `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
    headers: {
      authorization: MySecretKey,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    },
  };

  const response = await axios(options);
  return response.data;
};
