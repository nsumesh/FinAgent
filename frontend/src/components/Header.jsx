import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <div className={styles.header}>
      <input
        className={styles.search}
        type="text"
        placeholder="Search for stocks & more"
      />
    </div>
  );
}
