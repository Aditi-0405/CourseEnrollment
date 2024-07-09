
import {connectToDb} from '@/lib/dbConnection/connect';
import Student from '@/lib/models/Student';
import { isAuthenticated } from '@/lib/authentication/isAuthenticated';
import { NextResponse } from 'next/server';
import Admin from '@/lib/models/Admin'

const handler = async (req, {params}) => {
    await connectToDb();
  
    try {
      const admin= Admin.findById(req.user.userId)
      if(!admin){
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const data = await req.json();
      const id = params.id
      const { username, semester, paymentStatus, courseRegistration, courses } = data;
      const student = await Student.findById(id);
  
      if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
      }
  
      student.username = username || student.username;
      student.semester = semester || student.semester;
      student.paymentStatus = paymentStatus || student.paymentStatus;
      student.courseRegistration = courseRegistration || student.courseRegistration;
      student.courses = courses || student.courses;
  
      await student.save();
  
      return NextResponse.json({ message: 'Student updated successfully', student }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error updating student' }, { status: 500 });
    }
  }
  export const PATCH = isAuthenticated(handler);