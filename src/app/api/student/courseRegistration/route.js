
import {connectToDb} from '@/lib/dbConnection/connect';
import Student from '@/lib/models/Student';
import Course from '@/lib/models/Course';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/authentication/isAuthenticated';

const handler = async(req) => {
  await connectToDb();

  try {
    const data = await req.json();
    const studentId = req.user.userId
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }
    const semester = student.semester;
    const course = await Course.findOne({semester: semester})
    const { selectedSubjects } = data;
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    if (student.courseRegistration) {
      return NextResponse.json({ message: 'Student has already registered for courses' }, { status: 400 });
    }

    let validSelection = true;
    const unavailableSubjects = [];
    const selectedCourses = [];
    const unselectedCategories =[];
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
      else{
        unselectedCategories.push(category.categoryName);
      }

      return category;
    });

    if (!validSelection) {
      return NextResponse.json({ message: 'Selected subjects do not have available seats', unavailableSubjects }, { status: 400 });
    }
    if(unselectedCategories.length>0){
        return NextResponse.json({ message: 'The following categories were not selected', unselectedCategories }, { status: 400 });
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
export const POST = isAuthenticated(handler);