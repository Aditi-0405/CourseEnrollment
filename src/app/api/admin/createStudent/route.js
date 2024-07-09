
import {connectToDb} from '@/lib/dbConnection/connect';
import Student from '@/lib/models/Student';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/authentication/isAuthenticated';
import Admin from '@/lib/models/Admin'

const handler = async(req) =>  {
  await connectToDb();

  try {
    const admin= Admin.findById(req.user.userId)
    if(!admin){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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
export const POST = isAuthenticated(handler);