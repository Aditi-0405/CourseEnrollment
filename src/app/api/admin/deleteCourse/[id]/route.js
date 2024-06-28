
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Course from '@/app/lib/models/Course';
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
  export const DELETE = isAuthenticated(handler);