'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '@/styles/admin/course.module.css';

const EditSemester = ({ params }) => {
    const router = useRouter();
    const id = params.id;
    const [course, setCourse] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/admin/allCourses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch course');
                }
                const data = await response.json();
                setCourse(data.course);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (token && id) {
            fetchCourse();
        }
    }, [token, id]);

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/admin/updateCourse/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    semester: course.semester,
                    categories: course.category
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update course');
            }
            alert('Course updated successfully');
            router.push('/admin/allCourses');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCancel = () => {
        router.push('/admin/allCourses');
    };

    const handleAddCategory = () => {
        const newCategory = {
            categoryName: '',
            categoryCredit: 0,
            subjects: [{ name: '', totalIntake: 0, availableSeats: 0 }],
        };
        setCourse({
            ...course,
            category: [...course.category, newCategory],
        });
    };

    const handleRemoveCategory = (index) => {
        const newCategories = [...course.category];
        newCategories.splice(index, 1);
        setCourse({ ...course, category: newCategories });
    };

    const handleAddSubject = (catIdx) => {
        const newSubject = { name: '', totalIntake: 0, availableSeats: 0 };
        const newCategories = [...course.category];
        newCategories[catIdx].subjects.push(newSubject);
        setCourse({ ...course, category: newCategories });
    };

    const handleRemoveSubject = (catIdx, subIdx) => {
        const newCategories = [...course.category];
        newCategories[catIdx].subjects.splice(subIdx, 1);
        setCourse({ ...course, category: newCategories });
    };

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (!course) return null;

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Edit Semester {course.semester}</h1>
            <div className={styles.formGroup}>
                <label className={styles.label}>Semester:</label>
                <input
                    type="text"
                    value={course.semester}
                    onChange={(e) => setCourse({ ...course, semester: e.target.value })}
                    className={styles.input}
                />
            </div>
            {course.category.map((category, catIdx) => (
                <div key={catIdx} className={styles.formGroup}>
                    <h3 className={styles.category}>{category.categoryName} (Credits: {category.categoryCredit})</h3>
                    <div>
                        <label className={styles.label}>Category Name:</label>
                        <input
                            type="text"
                            value={category.categoryName}
                            onChange={(e) => {
                                const newCategories = [...course.category];
                                newCategories[catIdx].categoryName = e.target.value;
                                setCourse({ ...course, category: newCategories });
                            }}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Category Credit:</label>
                        <input
                            type="number"
                            value={category.categoryCredit}
                            onChange={(e) => {
                                const newCategories = [...course.category];
                                newCategories[catIdx].categoryCredit = e.target.value;
                                setCourse({ ...course, category: newCategories });
                            }}
                            className={styles.input}
                        />
                    </div>
                    <ul>
                        {category.subjects.map((subject, subIdx) => (
                            <li key={subIdx} className={styles.subjectContainer}>
                                <div>
                                    <label className={styles.subjectLabel}>Subject Name:</label>
                                    <input
                                        type="text"
                                        value={subject.name}
                                        onChange={(e) => {
                                            const newSubjects = [...course.category[catIdx].subjects];
                                            newSubjects[subIdx].name = e.target.value;
                                            const newCategories = [...course.category];
                                            newCategories[catIdx].subjects = newSubjects;
                                            setCourse({ ...course, category: newCategories });
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                                <div>
                                    <label className={styles.subjectLabel}>Total Intake:</label>
                                    <input
                                        type="number"
                                        value={subject.totalIntake}
                                        onChange={(e) => {
                                            const newSubjects = [...course.category[catIdx].subjects];
                                            newSubjects[subIdx].totalIntake = e.target.value;
                                            const newCategories = [...course.category];
                                            newCategories[catIdx].subjects = newSubjects;
                                            setCourse({ ...course, category: newCategories });
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                                <div>
                                    <label className={styles.subjectLabel}>Available Seats:</label>
                                    <input
                                        type="number"
                                        value={subject.availableSeats}
                                        onChange={(e) => {
                                            const newSubjects = [...course.category[catIdx].subjects];
                                            newSubjects[subIdx].availableSeats = e.target.value;
                                            const newCategories = [...course.category];
                                            newCategories[catIdx].subjects = newSubjects;
                                            setCourse({ ...course, category: newCategories });
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                                <button onClick={() => handleRemoveSubject(catIdx, subIdx)} className={`${styles.button} ${styles.removeButton}`}>Remove Subject</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => handleAddSubject(catIdx)} className={styles.button}>Add Subject</button>
                    <button onClick={() => handleRemoveCategory(catIdx)} className={styles.button}>Remove Category</button>
                </div>
            ))}
            <button onClick={handleAddCategory} className={styles.button}>Add Category</button>
            <button onClick={handleSave} className={styles.button}>Save</button>
            <button onClick={handleCancel} className={styles.button}>Cancel</button>
        </div>
    );
};

export default EditSemester;
