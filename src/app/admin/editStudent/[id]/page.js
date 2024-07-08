'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '@/styles/admin/editStudent.module.css';

export default function EditStudent({ params }) {
    const router = useRouter();
    const id = params.id;
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        semester: '',
        paymentStatus: false,
        courseRegistration: false,
        courses: [],
    });

    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await fetch(`/api/admin/getStudent/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch student');
                }
                const data = await res.json();
                setStudent(data.student);
                setFormData({
                    username: data.student.username,
                    semester: data.student.semester,
                    paymentStatus: data.student.paymentStatus,
                    courseRegistration: data.student.courseRegistration,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching student:', error);
                setError('Error fetching student');
                setLoading(false);
            }
        };

        if (token && id) {
            fetchStudent();
        }
    }, [token, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/students/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                throw new Error('Failed to update student');
            }
            const data = await res.json();
            alert(data.message);
            router.push(`/students/${student.semester}`);
        } catch (error) {
            console.error('Error updating student:', error);
            setError('Error updating student');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={styles.container}>
            <h1>Edit Student</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="semester">Semester:</label>
                    <input
                        type="text"
                        id="semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>
                        <input
                            type="checkbox"
                            name="paymentStatus"
                            checked={formData.paymentStatus}
                            onChange={handleCheckboxChange}
                        />
                        Payment Status
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label>
                        <input
                            type="checkbox"
                            name="courseRegistration"
                            checked={formData.courseRegistration}
                            onChange={handleCheckboxChange}
                        />
                        Course Registration
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="courses">Courses:</label>
                    <textarea
                        id="courses"
                        name="courses"
                        value={formData.courses}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Update Student
                </button>
            </form>
        </div>
    );
}
