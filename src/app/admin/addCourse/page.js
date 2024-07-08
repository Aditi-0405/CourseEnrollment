'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const CreateCourse = () => {
    const router = useRouter();
    const [course, setCourse] = useState({ semester: '', categories: [] });
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
            const response = await fetch('/api/admin/createCourse', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(course),
            });
            if (!response.ok) {
                throw new Error('Failed to create course');
            }
            alert('Course created successfully');
            router.push('/courses');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = () => {
        const newCategory = {
            categoryName: '',
            categoryCredit: 0,
            subjects: [{ name: '', totalIntake: 0, availableSeats: 0 }],
        };
        setCourse({
            ...course,
            categories: [...course.categories, newCategory],
        });
    };

    const handleRemoveCategory = (index) => {
        const newCategories = [...course.categories];
        newCategories.splice(index, 1);
        setCourse({ ...course, categories: newCategories });
    };

    const handleAddSubject = (catIdx) => {
        const newSubject = { name: '', totalIntake: 0, availableSeats: 0 };
        const newCategories = [...course.categories];
        newCategories[catIdx].subjects.push(newSubject);
        setCourse({ ...course, categories: newCategories });
    };

    const handleRemoveSubject = (catIdx, subIdx) => {
        const newCategories = [...course.categories];
        newCategories[catIdx].subjects.splice(subIdx, 1);
        setCourse({ ...course, categories: newCategories });
    };

    return (
        <div>
            <h1>Create Course</h1>
            <div>
                <label>Semester:</label>
                <input
                    type="text"
                    value={course.semester}
                    onChange={(e) => setCourse({ ...course, semester: e.target.value })}
                />
            </div>
            {course.categories.map((category, catIdx) => (
                <div key={catIdx}>
                    <h3>{category.categoryName} (Credits: {category.categoryCredit})</h3>
                    <div>
                        <label>Category Name:</label>
                        <input
                            type="text"
                            value={category.categoryName}
                            onChange={(e) => {
                                const newCategories = [...course.categories];
                                newCategories[catIdx].categoryName = e.target.value;
                                setCourse({ ...course, categories: newCategories });
                            }}
                        />
                    </div>
                    <div>
                        <label>Category Credit:</label>
                        <input
                            type="number"
                            value={category.categoryCredit}
                            onChange={(e) => {
                                const newCategories = [...course.categories];
                                newCategories[catIdx].categoryCredit = e.target.value;
                                setCourse({ ...course, categories: newCategories });
                            }}
                        />
                    </div>
                    <ul>
                        {category.subjects.map((subject, subIdx) => (
                            <li key={subIdx}>
                                <div>
                                    <label>Subject Name:</label>
                                    <input
                                        type="text"
                                        value={subject.name}
                                        onChange={(e) => {
                                            const newSubjects = [...course.categories[catIdx].subjects];
                                            newSubjects[subIdx].name = e.target.value;
                                            const newCategories = [...course.categories];
                                            newCategories[catIdx].subjects = newSubjects;
                                            setCourse({ ...course, categories: newCategories });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label>Total Intake:</label>
                                    <input
                                        type="number"
                                        value={subject.totalIntake}
                                        onChange={(e) => {
                                            const newSubjects = [...course.categories[catIdx].subjects];
                                            newSubjects[subIdx].totalIntake = e.target.value;
                                            const newCategories = [...course.categories];
                                            newCategories[catIdx].subjects = newSubjects;
                                            setCourse({ ...course, categories: newCategories });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label>Available Seats:</label>
                                    <input
                                        type="number"
                                        value={subject.availableSeats}
                                        onChange={(e) => {
                                            const newSubjects = [...course.categories[catIdx].subjects];
                                            newSubjects[subIdx].availableSeats = e.target.value;
                                            const newCategories = [...course.categories];
                                            newCategories[catIdx].subjects = newSubjects;
                                            setCourse({ ...course, categories: newCategories });
                                        }}
                                    />
                                </div>
                                <button onClick={() => handleRemoveSubject(catIdx, subIdx)}>Remove Subject</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => handleAddSubject(catIdx)}>Add Subject</button>
                    <button onClick={() => handleRemoveCategory(catIdx)}>Remove Category</button>
                </div>
            ))}
            <button onClick={handleAddCategory}>Add Category</button>
            <button onClick={handleSave} disabled={loading}>Save</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CreateCourse;
