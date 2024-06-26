
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Student from '@/app/lib/models/Student';
import { NextResponse } from 'next/server';

export async function PATCH(req, {params}) {
    await connectToDb();
  
    try {
      const data = await req.json();
      const id = params.id
      const { username, semester, paymentStatus, courseRegistration, courses } = data;
      console.log(id)
  
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