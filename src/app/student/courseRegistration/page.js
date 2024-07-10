'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/student/courseRegistration.module.css';

const CourseRegistrationComponent = () => {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter()
  

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('/api/student/getProfile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudent(data.student);
        } else {
          setError('Failed to fetch student data');
        }
      } catch (error) {
        setError(`Error fetching student data: ${error.message}`);
      }
    };

    if (token) {
      fetchStudentData();
    }
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/student/getCourse', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLoading(false);
          setCourses(data.course);
        } else {
          setLoading(false);
          setError('Failed to fetch courses');
        }
      } catch (error) {
        setLoading(false);
        setError(`Error fetching courses: ${error.message}`);
      }
    };

    if (student) {
      fetchCourses();
    }
  }, [student, token]);

  const handleCourseChange = (categoryId, subjectId) => {
    setSelectedCourses((prevSelectedCourses) => ({
      ...prevSelectedCourses,
      [categoryId]: subjectId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedSubjects = Object.values(selectedCourses);
    try {
      const response = await fetch('/api/student/courseRegistration', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedSubjects }),
      });

      if (response.ok) {
        setSuccessMessage('Course Registration Successful');
      } else {
        const data = await response.json();

        if (data.unavailableSubjects && data.unavailableSubjects.length > 0) {
          const subjectsList = data.unavailableSubjects.join(', ');
          const errorMessage = `The following subjects are unavailable: ${subjectsList}. Please choose different subjects.`;
          setError(errorMessage);
        } else if (data.unselectedCategories && data.unselectedCategories.length > 0) {
          const categoryList = data.unselectedCategories.join(', ');
          const errorMessage = `The following categories are not selected: ${categoryList}. Please choose one subject from each category.`;
          setError(errorMessage);
        } else {
          setError(data.message || 'Failed to register courses.');
        }

        return;
      }
    } catch (error) {
      setError('Error registering courses');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Course Registration</h1>
      {loading ? (
        <p>Loading...</p>
      ) : student ? (
        student.paymentStatus ? (
          student.courseRegistration ? (
            <div>
              <h2>Student and Course Info</h2>
              <div>
                <p><strong>Username:</strong> {student.username}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Semester:</strong> {student.semester}</p>
                <p><strong>Registered Courses:</strong></p>
                <ul>
                  {student.courses.map(course => (
                    <li key={course._id}>
                      {course.categoryName}: {course.courseName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : courses ? (
            <div className={styles.coursesContainer}>
              <h2>Available Courses</h2>
              <form onSubmit={handleSubmit}>
                {courses.category.map((category) => (
                  <div key={category._id} className={styles.category}>
                    <h3>{category.categoryName}</h3>
                    <select
                      value={selectedCourses[category._id] || ''}
                      onChange={(e) => handleCourseChange(category._id, e.target.value)}
                      className={styles.select}
                    >
                      <option value="">Select a course</option>
                      {category.subjects.map((subject) => (
                        <option key={subject._id} value={subject.name}>
                          {subject.name} - Available Seats: {subject.availableSeats}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <button type="submit" className={styles.button}>
                  Register Courses
                </button>
              </form>
            </div>
          ) : (
            <p>No courses available</p>
          )
        ) : (
          <div>
            <p>Payment is pending. Please complete the payment to register for courses.</p>
            <button onClick={() => router.push('/student/payment')}>
              Payment
            </button>
          </div>

        )
      ) : (
        <p>No student data available</p>
      )}
      {error && <p>{error}</p>}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default CourseRegistrationComponent;
