
import { connectToDb } from '@/lib/dbConnection/connect';
import Course from '@/lib/models/Course';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/authentication/isAuthenticated';
import Admin from '@/lib/models/Admin'

const handler = async (req) => {
  await connectToDb();

  try {
    const admin = Admin.findById(req.user.userId)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();
    const { semester, categories } = data;
    const existingCourse = await Course.findOne({ semester: semester })

    const formattedCategories = categories.map(category => ({
      categoryName: category.categoryName,
      categoryCredit: category.categoryCredit,
      subjects: category.subjects.map(subject => ({
        name: subject.name,
        totalIntake: subject.totalIntake,
        availableSeats: subject.availableSeats
      }))
    }));
    if (existingCourse) {
      existingCourse.category = formattedCategories
      await existingCourse.save();
    }
    else {
      const newCourse = new Course({
        semester,
        category: formattedCategories
      });

      await newCourse.save();
    }

    return NextResponse.json({ message: 'Course created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating course', error: error.message }, { status: 500 });
  }
}
export const POST = isAuthenticated(handler);