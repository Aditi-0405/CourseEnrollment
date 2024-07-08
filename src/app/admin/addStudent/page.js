'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


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
        <div>
            <h1>Create Student</h1>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={student.email}
                    onChange={(e) => setStudent({ ...student, email: e.target.value })}
                />
            </div>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={student.username}
                    onChange={(e) => setStudent({ ...student, username: e.target.value })}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={student.password}
                    onChange={(e) => setStudent({ ...student, password: e.target.value })}
                />
            </div>
            <div>
                <label>Semester:</label>
                <input
                    type="text"
                    value={student.semester}
                    onChange={(e) => setStudent({ ...student, semester: e.target.value })}
                />
            </div>
            <button onClick={handleSave} disabled={loading}>Save</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CreateStudent;
