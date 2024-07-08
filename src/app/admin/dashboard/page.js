
import Link from 'next/link';
import styles from '@/styles/admin/dashboard.module.css';

const AdminDashboard = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      <div className={styles.options}>
        <div className={styles.option}>
          <Link href="/admin/allStudents" className={styles.link}>
           Student
          </Link>
        </div>
        <div className={styles.option}>
          <Link href="/admin/allCourses" className={styles.link}>
            Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
