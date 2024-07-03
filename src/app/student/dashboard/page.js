
import Link from 'next/link';
import styles from '@/styles/student/dashboard.module.css';

const StudentDashboard = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Student Dashboard</h1>
      <div className={styles.options}>
        <div className={styles.option}>
          <Link href="/course-registration" className={styles.link}>
           Course Registration
          </Link>
        </div>
        <div className={styles.option}>
          <Link href="/payment" className={styles.link}>
            Payment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
