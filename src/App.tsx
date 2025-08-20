import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import StudentDashboard from './components/StudentDashboard';
import PrintShopDashboard from './components/PrintShopDashboard';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';

function App(): JSX.Element {
  const { user, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState<boolean>(false);

  const handleLogout = () => {
    signOut();
  };

  const openAuth = () => {
    setShowAuth(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading JIIT Connect...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin (you can modify this logic)
  const isAdmin = user?.role === 'admin' || user?.email === 'printshop@jiit.ac.in';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation onOpenAuth={openAuth} user={user} onLogout={handleLogout} />
      
      <main className="flex-grow">
        {user ? (
          isAdmin ? (
            <PrintShopDashboard />
          ) : (
            <StudentDashboard />
          )
        ) : (
          <>
            <Hero onOpenAuth={openAuth} />
            <HowItWorks />
          </>
        )}
      </main>

      <Footer />

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}

export default App;
