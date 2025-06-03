import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PortfolioCarousel from './components/PortfolioCarousel';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ flex: 1, width: '100%' }}>
            <div style={{ width: '100%', height: '100%' }}>
              <PortfolioCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
