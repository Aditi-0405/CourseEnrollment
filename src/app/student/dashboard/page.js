'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/student/dashboard.module.css';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetch('/api/student/getProfile', {
          headers:{
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Network Error');
        }
        const data = await response.json();
        if (data) setStudent(data.student);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if(token){
      fetchStudentProfile();
    }
    
  }, [token]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  if (!student) {
    return <div className={styles.container}>No student data found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Student Dashboard</h1>
      <div className={styles.infoSection}>
        <p><strong>Username:</strong> {student.username}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Semester:</strong> {student.semester}</p>
      </div>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={() => router.push('/student/payment')}>
          Payment
        </button>
        <button className={styles.button} onClick={() => router.push('/student/courseRegistration')}>
          Course Registration
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
