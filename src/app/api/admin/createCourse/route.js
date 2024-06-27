
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Course from '@/app/lib/models/Course';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectToDb();

  try {
    const data = await req.json();
    const { semester, categories } = data;

    const formattedCategories = categories.map(category => ({
      categoryName: category.categoryName,
      categoryCredit: category.categoryCredit,
      subjects: category.subjects.map(subject => ({
        name: subject.name,
        totalIntake: subject.totalIntake,
        availableSeats: subject.availableSeats
      }))
    }));

    const newCourse = new Course({
      semester,
      category: formattedCategories
    });

    await newCourse.save();

    return NextResponse.json({ message: 'Course created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating course', error: error.message }, { status: 500 });
  }
}
