import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import PortfolioCarousel from './components/PortfolioCarousel';
import Auth from './pages/Auth';
import './App.css';
import FinAgentChat from './components/FinAgentChat';  
import { FaComments, FaTimes } from 'react-icons/fa';

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat toggle

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* Main content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <div style={{ flex: 1, width: '100%' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <PortfolioCarousel user={user} />
          </div>
        </div>
      </div>

      
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        {isChatOpen ? (
          <div style={{ position: 'relative' }}>
            <button
              className='floating-close-button'
              onClick={() => setIsChatOpen(false)}
            >
              <FaTimes />
            </button>
            <FinAgentChat user={user} />
          </div>
        ) : (
          <button
            className='floating-chat-button'
            onClick={() => setIsChatOpen(true)}
          >
            <FaComments size={28} />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
