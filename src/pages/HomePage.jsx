import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import DesignGrid from '../components/DesignGrid';
import JoinModal from '../components/JoinModal';

export default function HomePage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('home');

  return (
    <div className="page-transition-enter" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onJoinClick={() => setIsJoinModalOpen(true)} 
      />
      
      <main style={{ flex: 1 }}>
        <Hero onJoinClick={() => setIsJoinModalOpen(true)} />
        
        <div className="section-container" style={{ paddingBottom: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
            <div style={{ maxWidth: '800px', textAlign: 'center' }}>
              <h2 className="section-title-large" style={{ marginBottom: '20px' }}>Built for the bold.</h2>
              <p style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                A student developer community engineered to push boundaries, break legacy systems, and build robust digital architectures.
              </p>
            </div>
          </div>
        </div>
        
        <DesignGrid />
      </main>

      <Footer />

      {isJoinModalOpen && (
        <JoinModal 
          onClose={() => setIsJoinModalOpen(false)}
          defaultInterest="web"
          onSuccess={() => setIsJoinModalOpen(false)}
        />
      )}
    </div>
  );
}
