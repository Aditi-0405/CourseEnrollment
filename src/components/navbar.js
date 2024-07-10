'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authcontext';
import styles from '@/styles/shared/navbar.module.css';

const Navbar = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>CollegeApp</div>
      <ul className={styles.navList}>
        <li className={router.pathname === '/' ? styles.activeNavItem : styles.navItem}>
          <Link href="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className={styles.navItem}>
              <span>Welcome, {username}</span>
            </li>
            <li className={styles.navItem}>
              <button onClick={logout} className={styles.logoutButton}>Logout</button>
            </li>
          </>
        ) : (
          <li className={router.pathname === '/login' ? styles.activeNavItem : styles.navItem}>
            <Link href="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
