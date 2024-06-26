
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Student from '@/app/lib/models/Student';
import { NextResponse } from 'next/server';

export async function DELETE(req, {params}) {
    await connectToDb();
  
    try {
      const id = params.id
      const student = await Student.findByIdAndDelete(id);

      if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error deleting student' }, { status: 500 });
    }
  }