
import {connectToDb} from '@/lib/dbConnection/connect';
import Student from '@/lib/models/Student';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/authentication/isAuthenticated';
import Admin from '@/lib/models/Admin'

const handler = async(req, {params}) => {
    await connectToDb();
    const admin= Admin.findById(req.user.userId)
    if(!admin){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      const sem = params.sem
      const students = await Student.find({ semester: sem }).select('-password');
      return NextResponse.json({ students }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error finding students' }, { status: 500 });
    }
  }
  export const GET = isAuthenticated(handler);