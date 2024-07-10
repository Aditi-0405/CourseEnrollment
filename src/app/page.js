'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import styles from '../styles/shared/home.module.css';
import Link from 'next/link';

const Home = () => {
  const { isLoggedIn, username } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const type = localStorage.getItem('type')
    if (isLoggedIn) {
      if (type === 'admin') {
        router.push('/admin/dashboard');
      } else if(type === 'student'){
        router.push('/student/dashboard');
      }
    }
  }, [isLoggedIn, username, router]);

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Login</h1>
      <div className={styles.description}>
        <p>Select your login type:</p>
      </div>
      <div>
        <Link href="/admin/login" className={styles.card}>
          <h3>Admin Login &rarr;</h3>
        </Link>
        <Link href="/student/login" className={styles.card}>
          <h3>Student Login &rarr;</h3>
        </Link>
      </div>
    </div>
  );
};

export default Home;
