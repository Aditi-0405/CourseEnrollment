'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/admin/studentsInfo.module.css';

export default function Students({ params }) {
    const sem = params.sem;
    const [students, setStudents] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        semester: '',
    });

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
                        setLoading(false);
                        setError('Failed to fetch students');
                        return;
                    }
                    const data = await res.json();
                    setStudents(data.students || []);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching students:', error);
                    setLoading(false);
                    setError(true);
                }
            };
            if (token) {
                fetchStudents();
            }
        }
    }, [token, sem]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEdit = (student) => {
        setEditingStudentId(student._id);
        setFormData({
            username: student.username,
            semester: student.semester,
        });
    };

    const handleSave = async (studentId) => {
        try {
            const res = await fetch(`/api/admin/updateStudent/${studentId}`, {
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
            setStudents(students.map(student => student._id === studentId ? { ...student, ...formData } : student));
            setEditingStudentId(null);
        } catch (error) {
            console.error('Error updating student:', error);
            setError('Error updating student');
        }
    };

    const handleDelete = async (studentId) => {
        try {
            const res = await fetch(`/api/admin/deleteStudent/${studentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                setStudents(students.filter(student => student._id !== studentId));
            } else {
                console.error('Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

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
                            {students && students.map((student) => (
                                <li key={student._id} className={styles.studentItem}>
                                    {editingStudentId === student._id ? (
                                        <>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                            />
                                            <input
                                                type="text"
                                                name="semester"
                                                value={formData.semester}
                                                onChange={handleInputChange}
                                            />
                                            <button
                                                onClick={() => handleSave(student._id)}
                                                className={styles.saveButton}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingStudentId(null)}
                                                className={styles.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {student.username} - {student.email} - {student.semester}
                                            <button
                                                onClick={() => handleEdit(student)}
                                                className={styles.editButton}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student._id)}
                                                className={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
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
