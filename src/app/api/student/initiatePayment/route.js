
import { initializePayment } from '@/lib/payment/paystack';
import Student from '@/lib/models/Student';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/authentication/isAuthenticated';

const handler = async(req) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const data = await req.json();
    const { amount, email } = data
    const studentId = req.user.userId
    const form = {
      amount: amount * 100,
      email
    };
    const student  = await Student.findById(studentId);
    if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const response = await initializePayment(form);
    const pay_reference = response.data.reference
    student.pay_reference = pay_reference
    await student.save();

    return NextResponse.json({ authorization_url: response.data.authorization_url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}
export const POST = isAuthenticated(handler);