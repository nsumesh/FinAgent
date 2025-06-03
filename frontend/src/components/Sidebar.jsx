import React from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>AI WATCHLIST</div>
        
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>MAIN MENU</div>
        <ul className={styles.nav}>
          <li>Home</li>
          <li>Exchange</li>
          <li>Stock & Fund</li>
          <li>Wallets</li>
          <li>Crypto</li>
        </ul>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>SUPPORT</div>
        <ul className={styles.nav}>
          <li>Community</li>
          <li>Help & Support</li>
        </ul>
      </div>
    </div>
  );
}
