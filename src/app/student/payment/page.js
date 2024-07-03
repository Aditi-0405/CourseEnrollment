'use client';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/student/dashboard.module.css';

const ParentComponent = () => {
  const [student, setStudent] = useState(null);
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

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/student/initiatePayment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@gmail.com', amount: 1000 }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to initiate payment.');
        return;
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Payment initiated successfully:', data);
  
        const newTab = window.open(data.authorization_url, '_blank');
        if (!newTab) {
          setError('Popup blocked! Please allow popups for this site.');
        }
      } else {
        console.error('Response is not in JSON format.');
        setError('Failed to process payment.');
      }
    } catch (error) {
      setError(`Error initiating payment: ${error.message}`);
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Student Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : student ? (
        <div className={styles.paymentContainer}>
          <h2>Payment Status</h2>
          <div className={`${styles.paymentStatus} ${student.paymentStatus ? styles.success : styles.pending}`}>
            {student.paymentStatus ? (
              <p>Payment has been made successfully.</p>
            ) : (
              <div>
                <p>Payment is pending.</p>
                <div className={styles.buttonContainer}>
                  <button className={styles.button} onClick={handlePayment}>Proceed to Pay</button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.studentPayment}>
            <h2>Student Payment</h2>
            <div className={styles.paymentDetails}>
              <p><strong>Username:</strong> {student.username}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Semester:</strong> {student.semester}</p>
              <p><strong>Course Registration:</strong> {student.courseRegistration ? 'Registered' : 'Not Registered'}</p>
              <p><strong>Courses:</strong></p>
              <ul>
                {student.courses.map(course => (
                  <li key={course._id}>
                    {course.categoryName}: {course.courseName}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      ) : (
        <p>No student data available</p>
      )}
    </div>
  );
};

export default ParentComponent;
