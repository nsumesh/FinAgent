import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PortfolioCarousel from './components/PortfolioCarousel';
import Auth from './pages/Auth';

function App() {
  const [user, setUser] = useState(null);

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
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ flex: 1, width: '100%' }}>
            <div style={{ width: '100%', height: '100%' }}>
              <PortfolioCarousel user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
