
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Admin from '@/app/lib/models/Admin';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const secret = process.env.JWT_SECRET

export async function POST(req) {
  try {
    await connectToDb();
    const data = await req.json();
    const { email, password } = data;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const payload = { userId: admin._id, email: admin.email };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
