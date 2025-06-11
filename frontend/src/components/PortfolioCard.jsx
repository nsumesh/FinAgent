// PortfolioCard.jsx
import React, {useEffect, useState} from 'react';
import styles from './PortfolioCard.module.css';

export default function PortfolioCard({ company_name, ticker, value, quantity, bought_at, onDelete, currentPrice}) {

  let priceClass = '';
  if (currentPrice !== null) {
    if (currentPrice > value) {
      priceClass = styles.greenText;
    } else if (currentPrice < value) {
      priceClass = styles.redText;
    }
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.companyName}>{company_name}</h3>
      <p className={styles.ticker}>{ticker}</p>

      <p><strong>Quantity:</strong> {quantity}</p>
      <p><strong>Price bought at:</strong> ${value}</p>
      <p><strong>Date bought on:</strong> {new Date(bought_at).toLocaleDateString()}</p>

      {currentPrice !== null && (
        <p>
        <strong>Current price:</strong>{' '}
        {currentPrice !== null && (
          <span className={currentPrice > value ? styles.greenText : styles.redText}>
            ${currentPrice.toFixed(2)}
          </span>
        )}
      </p>      
       )}

      <button className={styles.deleteButton} onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}


