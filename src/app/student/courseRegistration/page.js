'use client';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/student/courseRegistration.module.css';

const CourseRegistrationComponent = () => {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

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
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStudentData();
    } else {
      setLoading(false);
      setError('Token not found. Please login.');
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
          setCourses(data.course);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (error) {
        setError(`Error fetching courses: ${error.message}`);
      }
    };

    if (student && student.paymentStatus) {
      fetchCourses();
    }
  }, [student, token]);

  const handleCourseChange = (categoryId, subjectId) => {
    setSelectedCourses((prevSelectedCourses) => ({
      ...prevSelectedCourses,
      [categoryId]: subjectId,
    }));
  };

  const handleSubmit = async () => {
    const selectedCourseIds = Object.values(selectedCourses);
    try {
      const response = await fetch('/api/student/registerCourses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courses: selectedCourseIds }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to register courses.');
        return;
      }

      const data = await response.json();
      console.log('Courses registered successfully:', data);
    } catch (error) {
      setError(`Error registering courses: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Course Registration</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : student ? (
        student.paymentStatus ? (
          courses ? (
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
                        <option key={subject._id} value={subject._id}>
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
          <p>Payment is pending. Please complete the payment to register for courses.</p>
        )
      ) : (
        <p>No student data available</p>
      )}
    </div>
  );
};

export default CourseRegistrationComponent;
