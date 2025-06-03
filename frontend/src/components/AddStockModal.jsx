// src/components/AddStockModal.jsx
import React, { useState } from 'react';
import styles from './AddStockModal.module.css';

export default function AddStockModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '',
    ticker: '',
    change: '',
    value: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, ticker, change, value } = form;
    if (!name || !ticker || isNaN(change) || isNaN(value)) {
      alert('Please enter valid inputs');
      return;
    }

    onAdd({
      name,
      ticker,
      change: parseFloat(change),
      value: parseFloat(value),
      trend: parseFloat(change) >= 0 ? 'up' : 'down'
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>Add Stock</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.modalLabel}>
            Company Name
            <input
              className={styles.modalInput}
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Apple, Inc"
              required
            />
          </label>
          <label className={styles.modalLabel}>
            Ticker
            <input
              className={styles.modalInput}
              name="ticker"
              type="text"
              value={form.ticker}
              onChange={handleChange}
              placeholder="AAPL"
              required
            />
          </label>
          <label className={styles.modalLabel}>
            Change %
            <input
              className={styles.modalInput}
              name="change"
              type="number"
              value={form.change}
              onChange={handleChange}
              placeholder="0.66"
              step="0.01"
              required
            />
          </label>
          <label className={styles.modalLabel}>
            Value
            <input
              className={styles.modalInput}
              name="value"
              type="number"
              value={form.value}
              onChange={handleChange}
              placeholder="15215.7"
              required
            />
          </label>
          <div className={styles.modalActions}>
            <button type="button" className={styles.modalActionsCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.modalActionsSubmit}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
