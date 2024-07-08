
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Student from '@/app/lib/models/Student';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/app/lib/authentication/isAuthenticated';
import Admin from '@/app/lib/models/Admin'

const handler = async(req, {params}) => {
    await connectToDb();
    const admin= Admin.findById(req.user.userId)
    if(!admin){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      const id = params.id
      const student = await Student.findById(id).select('-password');
      if(!student){
        return NextResponse.json({ message: "Student not found" }, { status: 404 });
      }
      return NextResponse.json({ student }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error finding student' }, { status: 500 });
    }
  }
  export const GET = isAuthenticated(handler);