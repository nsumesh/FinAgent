import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import PortfolioCarousel from './components/PortfolioCarousel';
import Auth from './pages/Auth';
import './App.css';
import FinAgentChat from './components/FinAgentChat';  

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false); 
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'column' }}>
      <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
  }}
>
  <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>Your Portfolio</h1>
  <button
    onClick={handleLogout}
    style={{
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#2563eb',
      color: 'white',
      cursor: 'pointer',
    }}
  >
    Logout
  </button>
</div>


      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'60px' }}>
        <PortfolioCarousel user={user} />
      </div>

      {}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
        {showChat ? (
          <div style={{ position: 'relative' }}>
            <button
              className="floating-close-button"
              onClick={() => setShowChat(false)}
            >
              ×
            </button>
            <FinAgentChat user={user} />
          </div>
        ) : (
          <button
            className="floating-chat-button"
            onClick={() => setShowChat(true)}
          >
            💬
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
