'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/shared/form.module.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/adminLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 404) {
                    setError('Service unavailable. Please try again later.');
                } else {
                    setError(data.message || 'Invalid credentials');
                }
                return;
            }

            router.push('/admin/dashboard');
        } catch (error) {
            console.error('Error during login:', error);
            setError('Failed to login. Please try again later.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.heading}>Admin Login</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">Email:</label>
                        <input
                            className={styles.input}
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">Password:</label>
                        <input
                            className={styles.input}
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;