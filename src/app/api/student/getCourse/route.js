
import Student from '@/lib/models/Student';
import Course from '@/lib/models/Course'
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/authentication/isAuthenticated';

const handler = async(req) => {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const studentId = req.user.userId
    const student  = await Student.findById(studentId);
    if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }
    const semester = student.semester;
    const course = await Course.findOne({semester})
    if(!course){
        return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ course }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occured' }, { status: 500 });
  }
}
export const GET = isAuthenticated(handler);