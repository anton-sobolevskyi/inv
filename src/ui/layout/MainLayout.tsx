import TopMenu from './TopMenu';

import styles from './MainLayout.module.scss';
import Sidebar from './Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <TopMenu />
      </div>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
