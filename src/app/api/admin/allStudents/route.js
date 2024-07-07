
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Student from '@/app/lib/models/Student'
import Course from '@/app/lib/models/Course'
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/app/lib/authentication/isAuthenticated';
import Admin from '@/app/lib/models/Admin'

const handler = async (req) => {
  await connectToDb();

  try {
    const admin= Admin.findById(req.user.userId)
    if(!admin){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let semArray =[]
    const courses = await Course.find();
    courses.forEach((course) =>{
        let sem = course.semester
        if(!semArray.includes(sem)){
            semArray.push(sem);
        }
    })
    semArray.sort();
    return NextResponse.json({ semArray }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error finding semester list' }, { status: 500 });
  }
}
export const GET = isAuthenticated(handler);