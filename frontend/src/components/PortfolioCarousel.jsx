import React, { useRef, useState, useEffect } from 'react';
import PortfolioCard from './PortfolioCard';
import AddStockModal from './AddStockModal';
import styles from './PortfolioCarousel.module.css';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '@supabase/auth-helpers-react';

export default function PortfolioCarousel() {
  const containerRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stocks, setStocks] = useState([]);

  const session = useSession();

  useEffect(() => {
    const fetchStocks = async () => {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching stocks:', error);
      } else {
        setStocks(data);
      }
      const el = containerRef.current;
      setShowArrow(el && el.scrollWidth > el.clientWidth);
    };

    fetchStocks();
  }, [session]);

  const handleAddStock = async (stock) => {
    const user = session?.user;
    if (!user) return;
  
    try {
      const priceRes = await fetch(`http://localhost:5001/api/current-price?ticker=${stock.ticker}`);
      const priceData = await priceRes.json();
      const current_price = priceData?.current_price || 0;
      console.log('Polygon API raw response:', priceData);
      console.log("🧾 Inserting with current_price:", current_price);
  
      const payload = {
        ...stock,
        user_id: user.id,
        current_price, 
      };
  
      const { data, error } = await supabase
        .from('portfolios')
        .insert([payload])
        .select();
  
      if (error) {
        console.error("Supabase insert error:", error);
        alert('Error adding stock: ' + error.message);
        return;
      }
  
      console.log("Stock added to Supabase:", data);
      setStocks((prev) => [...prev, ...data]);
      setShowModal(false);
    } catch (err) {
      console.error("Unexpected exception during insert:", err);
      alert("Unexpected error occurred: " + err.message);
    }
  };
  

  const handleDeleteStock = async (id) => {
    const { error } = await supabase.from('portfolios').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete stock:', error);
      return;
    }

    setStocks((prev) => prev.filter((stock) => stock.id !== id));
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
        {stocks.map((stock) => (
          <PortfolioCard
            key={stock.id}
            {...stock}
            currentPrice={stock.current_price} 
            onDelete={() => handleDeleteStock(stock.id)}
          />
        ))}
      </div>

      {showArrow && <div className={styles.rightArrow}>→</div>}

      {showModal && session?.user && (
        <AddStockModal
          onAdd={handleAddStock}
          onClose={() => setShowModal(false)}
          userId={session.user.id}
        />
      )}
    </div>
  );
}
