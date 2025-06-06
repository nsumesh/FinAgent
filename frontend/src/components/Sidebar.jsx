import styles from './Sidebar.module.css';

export default function Sidebar({ isSidebarOpen }) {
  return (
    <div
      className={`${styles.sidebar} ${
        isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
      }`}
    >
      <div className={styles.logo}>Fin Agent</div>

      <div className={styles.section}>
        <h3>MAIN MENU</h3>
        <ul>
          <li>Home</li>
          <li>Exchange</li>
          <li>Stock & Fund</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3>SUPPORT</h3>
        <ul>
          <li>Community</li>
          <li>Help & Support</li>
        </ul>
      </div>
    </div>
  );
}
