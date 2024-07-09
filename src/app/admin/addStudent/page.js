'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '@/styles/shared/form.module.css'; 

const CreateStudent = () => {
    const router = useRouter();
    const [student, setStudent] = useState({ email: '', username: '', password: '', semester: '' });
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/createStudent', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(student),
            });
            if (!response.ok) {
                throw new Error('Failed to create student');
            }
            alert('Student created successfully');
            router.push('/admin/allStudents');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.heading}>Create Student</h1>
                <div className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={student.email}
                            onChange={(e) => setStudent({ ...student, email: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Username:</label>
                        <input
                            type="text"
                            value={student.username}
                            onChange={(e) => setStudent({ ...student, username: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={student.password}
                            onChange={(e) => setStudent({ ...student, password: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Semester:</label>
                        <input
                            type="text"
                            value={student.semester}
                            onChange={(e) => setStudent({ ...student, semester: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <button onClick={handleSave} disabled={loading} className={styles.button}>Save</button>
                </div>
                {loading && <p>Loading...</p>}
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
};

export default CreateStudent;
