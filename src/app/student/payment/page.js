'use client';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/student/dashboard.module.css';

const ParentComponent = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token) {
        setLoading(false);
        setError('Token not found. Please login.');
        return;
      }

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
    }
  }, [token]);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch('/api/student/verifyPayment', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.paymentStatus === 'success') {
          setStudent((prev) => ({ ...prev, paymentStatus: true, pay_reference: data.pay_reference }));
        }
      } else {
        setError('Please refresh to verify payment status');
      }
    } catch (error) {
      setError(`Error verifying payment status: ${error.message}`);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/student/initiatePayment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: `${student.email}`, amount: 1000 }),
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
        } else {
          const interval = setInterval(async () => {
            await checkPaymentStatus();
            if (student.paymentStatus) {
              clearInterval(interval);
            }
          }, 5000);
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
        <div className={styles.dashboardContent}>
          <div className={styles.studentInfo}>
            <h2>Student Information</h2>
            <p><strong>Username:</strong> {student.username}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Semester:</strong> {student.semester}</p>
            <p><strong>Course Registration:</strong> {student.courseRegistration ? 'Registered' : 'Not Registered'}</p>
            {student.courseRegistration && <p><strong>Courses:</strong></p>}
            
            <ul>
              {student.courses.map(course => (
                <li key={course._id}>
                  {course.categoryName}: {course.courseName}
                </li>
              ))}
            </ul>
          </div>
          
          <div className={styles.paymentSection}>
            <h2>Payment Status</h2>
            <div className={`${styles.paymentStatus} ${student.paymentStatus ? styles.success : styles.pending}`}>
              {student.paymentStatus ? (
                <div>
                  <p>Payment has been made successfully.</p>
                  <p>Your payment reference is: {student.pay_reference}</p>
                </div>
              ) : (
                <div>
                  <p>Payment is pending.</p>
                  <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={handlePayment}>Proceed to Pay</button>
                  </div>
                </div>
              )}
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
