
import { verifyPayment } from '@/app/lib/payment/paystack';
import Student from '@/app/lib/models/Student';
import { NextResponse } from 'next/server';

const handler = async() => {

  try {

    const studentId = req.user.userId
    const student  = await Student.findById(studentId);
    if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }
    if(student.paymentStatus===true){
        return NextResponse.json({ message: 'Payment verification successful', paymentStatus: "success" });
    }
    const reference = student.pay_reference
    const response = await verifyPayment(reference);
    if (response.data.status === 'success') {
      student.paymentStatus=true
      await student.save();
      return NextResponse.json({ message: 'Payment verification successful', paymentStatus: "success" });
    } else {
      return NextResponse.json({ message: 'Payment verification failed', paymentStatus: response.data.status }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Payment verification failed', message: error.message }, { status: 500 });
  }
}
export const GET = isAuthenticated(handler);
