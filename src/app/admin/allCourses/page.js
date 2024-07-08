'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';

const Courses = () => {
    const [courses, setCourses] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/admin/allCourses', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data.courses);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            fetchCourses();
        }
    }, [token]);

    return (
        <div>
            <h1>Courses</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {courses && courses.map((course) => (
                <div key={course._id}>
                    <h2>Semester {course.semester}</h2>
                    {course.category.map((category) => (
                        <div key={category._id}>
                            <h3>{category.categoryName} (Credits: {category.categoryCredit})</h3>
                            <ul>
                                {category.subjects.map((subject) => (
                                    <li key={subject._id}>
                                        {subject.name} (Available Seats: {subject.availableSeats}/{subject.totalIntake})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <Link href={`/admin/editCourse/${course._id}`}>
                        <button>Edit</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Courses;
