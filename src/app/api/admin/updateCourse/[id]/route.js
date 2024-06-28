
import { connectToDb } from '@/app/lib/dbConnection/connect';
import Course from '@/app/lib/models/Course';
import { isAuthenticated } from '@/app/lib/authentication/isAuthenticated';
import { NextResponse } from 'next/server';
import Admin from '@/app/lib/models/Admin'

const handler = async (req, {params}) => {
  await connectToDb();

  try {
    const data = await req.json();
    const { semester, categories } = data;
    const id = params.id;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    const admin= Admin.findById(req.user.userId)
    if(!admin){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let formattedCategories;
    if (categories) {
      formattedCategories = categories.map(category => ({
        categoryName: category.categoryName,
        categoryCredit: category.categoryCredit,
        subjects: category.subjects.map(subject => ({
          name: subject.name,
          totalIntake: subject.totalIntake,
          availableSeats: subject.availableSeats
        }))
      }));
    }

    course.semester = semester || course.semester;
    course.category = formattedCategories || course.category;

    await course.save();

    return NextResponse.json({ message: 'Course updated successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ message: 'Error updating course', error: error.message }, { status: 500 });
  }
};

export const PATCH = isAuthenticated(handler);
