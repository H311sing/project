import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import { HomeSection } from './components/HomeSection';
import { ContestsSection } from './components/ContestsSection';
import { IdeasSection } from './components/IdeasSection';
import { ContactsSection } from './components/ContactsSection';
import { RegistrationPage } from './components/RegistrationPage';
import { contests } from './data/contests';

function App() {
  const [activeTab, setActiveTab] = useState('contests');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showRegistration, setShowRegistration] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (section: string) => {
    setActiveTab(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegistrationSuccess = (userData: { name: string }) => {
    setUser(userData);
    setShowRegistration(false);
    scrollToSection('home');
  };

  const handleLogout = () => {
    setUser(null);
    setShowRegistration(true);
  };

  if (showRegistration) {
    return (
      <RegistrationPage
        onClose={() => setShowRegistration(false)}
        onSuccess={handleRegistrationSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={scrollToSection}
        onRegisterClick={() => setShowRegistration(true)}
        user={user}
        onLogout={handleLogout}
      />
      <ScrollToTop visible={showScrollTop} onClick={scrollToTop} />
      
      <main className="pt-16">
        <HomeSection onExploreClick={() => scrollToSection('contests')} />
        <ContestsSection contests={contests} />
        <IdeasSection />
        <ContactsSection />
      </main>
    </div>
  );
}

export default App;