
import {connectToDb} from '@/lib/dbConnection/connect';
import Student from '@/lib/models/Student';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const secret = process.env.JWT_SECRET

export async function POST(req) {
  try {
    await connectToDb();
    const data = await req.json();
    const { email, password } = data;

    const student = await Student.findOne({ email });
    if (!student) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const payload = { userId: student._id, email: student.email };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return NextResponse.json({ token, username: student.username, email: student.email }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
