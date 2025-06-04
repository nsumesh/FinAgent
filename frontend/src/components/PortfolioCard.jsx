// PortfolioCard.jsx
import React from 'react';
import styles from './PortfolioCard.module.css';

export default function PortfolioCard({ company_name, ticker, value, quantity, bought_at, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.companyName}>{company_name}</div>
        <div className={styles.ticker}>{ticker}</div>
      </div>

      <div className={styles.detail}>
        <strong>Quantity:</strong> {quantity}
      </div>

      <div className={styles.detail}>
        <span>Price bought at:</span> $ {value}
      </div>

      <div className={styles.detail}>
        <span>Date bought on:</span> {new Date(bought_at).toLocaleDateString()}
      </div>

      <button className={styles.deleteButton} onClick={onDelete}>Delete</button>
    </div>
  );
}
