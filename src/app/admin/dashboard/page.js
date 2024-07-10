
import Link from 'next/link';
import styles from '@/styles/admin/dashboard.module.css';

const AdminDashboard = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      <div className={styles.options}>
        <div className={styles.option}>
          <Link href="/admin/allStudents">
            <button className={styles.button}>Student</button>
          </Link>
        </div>
        <div className={styles.option}>
          <Link href="/admin/allCourses">
            <button className={styles.button}>Course</button>
          </Link>
        </div>
        <div className={styles.option}>
          <Link href="/admin/addCourse">
            <button className={styles.button}>Add Course</button>
          </Link>
        </div>
        <div className={styles.option}>
          <Link href="/admin/addStudent">
            <button className={styles.button}>Add Student</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
