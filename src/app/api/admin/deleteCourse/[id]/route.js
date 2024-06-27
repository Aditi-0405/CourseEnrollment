
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Course from '@/app/lib/models/Course';
import { NextResponse } from 'next/server';

export async function DELETE(req, {params}) {
    await connectToDb();
  
    try {
      const id = params.id
      const course = await Course.findByIdAndDelete(id);

      if (!course) {
        return NextResponse.json({ message: 'Course not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Course deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error deleting course' }, { status: 500 });
    }
  }