import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import PortfolioCarousel from './components/PortfolioCarousel';
import Auth from './pages/Auth';
import './App.css';
import FinAgentChat from './components/FinAgentChat';  

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      {}
   

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          transition: 'margin-left 0.3s ease-in-out',
          marginLeft: isSidebarOpen ? '200px' : '0px',
        }}
      >
        <div style={{ flex: 1, width: '100%' }}>
          <div style={{ width: '100%', height: '100%' }}>
            <PortfolioCarousel user={user} />
          </div>
        </div>
      </div>

      
      {user && <FinAgentChat user={user} />}
    </div>
  );
}

export default App;
