import React, { useState, useEffect } from 'react';
import styles from './AddStockModal.module.css';
import debounce from 'lodash.debounce';

export default function AddStockModal({ onAdd, onClose, userId }) {
  const [form, setForm] = useState({
    company_name: '',
    ticker: '',
    value: '',
    quantity: '',
    bought_at: ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Debounced fetch to backend
  const fetchCompanySuggestions = debounce(async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/search-tickers?query=${query}`);
      const data = await res.json();
      setSuggestions(data.results || []);
      setIsDropdownOpen(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 300);

  useEffect(() => {
    fetchCompanySuggestions(form.company_name);
    return fetchCompanySuggestions.cancel;
  }, [form.company_name]);

  const handleSuggestionClick = (company) => {
    setForm({
      ...form,
      company_name: company.name,
      ticker: company.ticker
    });
    setSuggestions([]);
    setIsDropdownOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    onAdd(stockData);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>Add Stock</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label className={styles.modalLabel}>
            Company Name
            <input
              name="company_name"
              type="text"
              value={form.company_name}
              onChange={handleChange}
              required
            />
            {isDropdownOpen && suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {suggestions.map((item) => (
                  <li key={item.ticker} onClick={() => handleSuggestionClick(item)}>
                    {item.name} ({item.ticker})
                  </li>
                ))}
              </ul>
            )}
          </label>

          <label className={styles.modalLabel}>
            Ticker
            <input
              name="ticker"
              type="text"
              value={form.ticker}
              onChange={handleChange}
              required
              disabled
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
