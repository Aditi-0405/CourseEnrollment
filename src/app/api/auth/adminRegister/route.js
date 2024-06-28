
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Admin from '@/app/lib/models/Admin';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectToDb();

  try {
    const data = await req.json();
    const { username, email, password } = data;
    const newAdmin = new Admin({
      username,
      email,
      password,
    });

    await newAdmin.save();
    return NextResponse.json({ message: 'Admin created successfully', newAdmin: newAdmin }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating Admin' }, { status: 500 });
  }
}
