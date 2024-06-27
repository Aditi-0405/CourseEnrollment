
import {connectToDb} from '@/app/lib/dbConnection/connect';
import Student from '@/app/lib/models/Student';
import Course from '@/app/lib/models/Course';
import { NextResponse } from 'next/server';

export async function POST(req, {params}) {
  await connectToDb();

  try {
    const data = await req.json();
    const studentId = "667d6888def48793467845c6"
    const courseId = params.id
    const { selectedSubjects } = data;
    console.log(selectedSubjects)
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    if (student.courseRegistration) {
      return NextResponse.json({ message: 'Student has already registered for courses' }, { status: 400 });
    }

    let validSelection = true;
    const unavailableSubjects = [];
    const selectedCourses = [];
    const updatedCategories = course.category.map(category => {
      const selectedSubject = category.subjects.find(subject =>
        selectedSubjects.includes(subject.name)
      );

      if (selectedSubject) {
        if (selectedSubject.availableSeats > 0) {
          selectedSubject.availableSeats -= 1;
          selectedCourses.push({
            categoryName: category.categoryName,
            categoryCredit: category.categoryCredit,
            courseName: selectedSubject.name
          });
        } else {
          validSelection = false;
          unavailableSubjects.push(selectedSubject.name);
        }
      }

      return category;
    });

    if (!validSelection) {
      return NextResponse.json({ message: 'Selected subjects do not have available seats', unavailableSubjects }, { status: 400 });
    }

    course.categary = updatedCategories;
    await course.save();

    student.courseRegistration = true;
    student.courses = selectedCourses;
    await student.save();

    return NextResponse.json({ message: 'Course registration successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error during course registration', error: error.message }, { status: 500 });
  }
}
