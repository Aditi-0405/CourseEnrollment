'use client'

import { useEffect, useState } from 'react';
import styles from '@/styles/admin/studentsInfo.module.css';

export default function Students({ params }) {
    const sem = params.sem;

    const [students, setStudents] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        if (sem) {
            const fetchStudents = async () => {
                try {
                    const res = await fetch(`/api/admin/allStudents/${sem}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!res.ok) {
                        setLoading(false)
                        setError('Failed to fetch students');
                    }
                    const data = await res.json();
                    setStudents(data.students || []);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching students:', error);
                    setLoading(false);
                    setError(true)
                }
            };
            if(token){
                fetchStudents();
            }
            
        }
    }, [token, sem]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Students for Semester {sem}</h1>
            {loading ? (
                <p className={styles.loading}>Loading...</p>
            ) : (
                <div className={styles.studentsContainer}>
                    {students && students.length === 0 ? (
                        <p>No students found for this semester.</p>
                    ) : (
                        <ul className={styles.studentList}>
                            {students.map((student) => (
                                <li key={student._id} className={styles.studentItem}>
                                    {student.username} - {student.email}
                                </li>
                            ))}
                        </ul>
                    )}
                    {error && <p>Error fetching students</p>}
                </div>
            )}
        </div>
    );
}
