import React from 'react';
import styles from './PortfolioCard.module.css';

export default function PortfolioCard({ name, ticker, change, value, trend, onRemove }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.logo}>🍎 {name}</span>
        <span className={`${styles.change} ${change >= 0 ? styles.green : styles.red}`}>
          {ticker} {change >= 0 ? '+' : ''}{change}%
        </span>
      </div>
      <div className={`${styles.chart} ${trend === 'up' ? styles.chartUp : styles.chartDown}`}></div>
      <div className={styles.label}>Portfolio</div>
      <div className={styles.value}>{value.toLocaleString()}</div>
      {onRemove && (
        <button className={styles.removeButton} onClick={onRemove}>Remove</button>
      )}
    </div>
  );
}
