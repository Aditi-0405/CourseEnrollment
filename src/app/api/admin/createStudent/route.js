
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Student from '@/app/lib/models/Student';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectToDb();

  try {
    const data = await req.json();
    const { username, email, password, semester } = data;
    const newStudent = new Student({
      username,
      email,
      password,
      semester,
    });

    await newStudent.save();
    return NextResponse.json({ message: 'Student created successfully', newStudent }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating student' }, { status: 500 });
  }
}
