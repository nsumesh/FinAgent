import React, { useState } from 'react';
import styles from './AddStockModal.module.css';
console.log('AddStockModal rendered');

export default function AddStockModal({ onAdd, onClose, userId }) {
  console.log("🔄 AddStockModal rendered with userId:", userId);
  const [form, setForm] = useState({
    company_name: '',
    ticker: '',
    value: '',
    quantity: '',
    bought_at: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 Submitting form...");
    console.log('🛂 userId inside handleSubmit:', userId);
    const { company_name, ticker, quantity, value, bought_at } = form;
  
    if (!company_name || !ticker || isNaN(value) || isNaN(quantity) || !bought_at) {
      alert('Please fill all fields correctly');
      return;
    }
  
    const stockData = {
      company_name,
      ticker,
      quantity: parseFloat(quantity),
      value: parseFloat(value),
      bought_at,
      user_id: userId,
    };
  
    console.log("✅ Validated form data:", stockData);
  
    onAdd(stockData);
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
              name="company_name"
              type="text"
              value={form.company_name}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.modalLabel}>
            Ticker
            <input
              name="ticker"
              type="text"
              value={form.ticker}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.modalLabel}>
            Value
            <input
              name="value"
              type="number"
              value={form.value}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.modalLabel}>
            Quantity
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.modalLabel}>
            Bought At
            <input
              name="bought_at"
              type="date"
              value={form.bought_at}
              onChange={handleChange}
              required
            />
          </label>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
