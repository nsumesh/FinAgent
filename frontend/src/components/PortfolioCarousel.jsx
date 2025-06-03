import React, { useRef, useState, useEffect } from 'react';
import PortfolioCard from './PortfolioCard';
import styles from './PortfolioCarousel.module.css';

export default function PortfolioCarousel() {
  const containerRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stocks, setStocks] = useState([
    { name: 'Apple, Inc', ticker: 'AAPL', change: 0.66, value: 15215.7, trend: 'up' },
  ]);

  useEffect(() => {
    const el = containerRef.current;
    setShowArrow(el && el.scrollWidth > el.clientWidth);
  }, [stocks]);

  const handleAddStock = (stock) => {
    setStocks((prev) => [...prev, stock]);
    setShowModal(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Your Stock Portfolio</h2>
        <button className={styles.addButton} onClick={() => setShowModal(true)}>
          ➕ Add Stock
        </button>
      </div>

      <div className={styles.scrollContainer} ref={containerRef}>
        {stocks.map((stock, i) => (
          <PortfolioCard
            key={i}
            {...stock}
            onRemove={() => setStocks(stocks => stocks.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>

      {showArrow && <div className={styles.rightArrow}>→</div>}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Add Stock</h3>
            <StockForm onSubmit={handleAddStock} onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function StockForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [change, setChange] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const parsedChange = parseFloat(change);
    const parsedValue = parseFloat(value);
    if (!name || !ticker || isNaN(parsedChange) || isNaN(parsedValue)) {
      alert('Please enter valid stock details.');
      return;
    }

    const trend = parsedChange >= 0 ? 'up' : 'down';
    onSubmit({ name, ticker, change: parsedChange, value: parsedValue, trend });
  };

  return (
    <div>
      <label>Company Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>Ticker</label>
      <input value={ticker} onChange={(e) => setTicker(e.target.value)} />

      <label>Change %</label>
      <input value={change} onChange={(e) => setChange(e.target.value)} type="number" />

      <label>Value</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} type="number" />

      <div className={styles.modalButtons}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleSubmit}>Add</button>
      </div>
    </div>
  );
}
