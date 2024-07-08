'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '@/styles/admin/studentsInfo.module.css';

export default function Semesters() {
    const [semArray, setSemArray] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        const fetchSemesters = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/admin/allStudents', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch semesters');
                }
                const data = await res.json();
                setLoading(false)
                setSemArray(data.semArray || []);

            } catch (error) {
                console.error('Error fetching semesters:', error.message);
                setLoading(false)
                setError('Failed to fetch semesters. Please try again.'); 
            } 
        };

        if (token) {
            fetchSemesters();
        }

    }, [token]);

    const handleSemesterClick = (semester) => {
        router.push(`/admin/allStudents/${semester}`);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Semesters</h1>
            {error && <p className={styles.error}>{error}</p>} 
            {loading ? (
                <p>Loading semesters...</p>
            ) : (
                <div className={styles.buttonContainer}>
                    {semArray && semArray.length > 0 ? (
                        semArray.map((semester) => (
                            <button
                                key={semester}
                                onClick={() => handleSemesterClick(semester)}
                                className={styles.button}
                            >
                                Semester {semester}
                            </button>
                        ))
                    ) : (
                        semArray && <p>No semesters found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
