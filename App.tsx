
import React, { useState, useEffect } from 'react';
import { TransformationProvider } from './context/TransformationContext';
import { SalesProvider } from './context/SalesContext';
import { User, UserRole } from './types';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PaymentsPage from './pages/PaymentsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminPaymentsConfig from './pages/AdminPaymentsConfig';
import AdminCMS from './pages/AdminCMS';
import Gallery from './pages/Gallery';
import HowItWorks from './pages/HowItWorks';
import PricingPage from './pages/PricingPage';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Testimonials from './pages/Testimonials';
import Faqs from './pages/Faqs';

export type ViewType =
  | 'LANDING'
  | 'AUTH'
  | 'DASHBOARD'
  | 'EDITOR'
  | 'PAYMENTS'
  | 'ADMIN'
  | 'USERS'
  | 'PAYMENTS_CONFIG'
  | 'CMS'
  | 'GALLERY'
  | 'HOW_IT_WORKS'
  | 'PRICING_PAGE'
  | 'TERMS'
  | 'PRIVACY'
  | 'TESTIMONIALS'
  | 'FAQS';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewType>('LANDING');

  const handleLogin = (role: UserRole) => {
    setUser({
      id: role === UserRole.ADMIN ? 'admin-1' : 'user-1',
      name: role === UserRole.ADMIN ? 'Admin Master' : 'John Doe',
      email: role === UserRole.ADMIN ? 'admin@3dokas.live' : 'john@3dokas.live',
      role: role,
      credits: role === UserRole.ADMIN ? 0 : 125,
      downloads: role === UserRole.ADMIN ? 0 : 42,
      avatar: role === UserRole.ADMIN ? 'https://picsum.photos/id/65/100/100' : 'https://picsum.photos/id/64/100/100',
      plan: role === UserRole.ADMIN ? 'Super Admin' : 'Pro Plan'
    });
    setView(role === UserRole.ADMIN ? 'ADMIN' : 'DASHBOARD');
  };

  const handleNavigate = (v: string) => {
    const targetView = v as ViewType;

    if (user) {
      if (['ADMIN', 'USERS', 'PAYMENTS_CONFIG', 'CMS'].includes(targetView) && user.role !== UserRole.ADMIN) {
        handleLogin(UserRole.ADMIN);
        return;
      }
      if (['DASHBOARD', 'EDITOR', 'PAYMENTS'].includes(targetView) && user.role === UserRole.ADMIN) {
        handleLogin(UserRole.USER);
        return;
      }
    }

    setView(targetView);
  };

  const addCredits = (amount: number) => {
    if (user) {
      setUser({ ...user, credits: user.credits + amount });
    }
  };

  const logout = () => {
    setUser(null);
    setView('LANDING');
  };

  const renderContent = () => {
    const publicRoutes: Partial<Record<ViewType, React.ReactNode>> = {
      'LANDING': <LandingPage onNavigate={setView} />,
      'AUTH': <AuthPage onLogin={handleLogin} onBack={() => setView('LANDING')} />,
      'GALLERY': <Gallery onBack={() => setView('LANDING')} />,
      'HOW_IT_WORKS': <HowItWorks onBack={() => setView('LANDING')} />,
      'PRICING_PAGE': <PricingPage onBack={() => setView('LANDING')} onStart={() => setView('AUTH')} onPurchase={addCredits} />,
      'TERMS': <Terms onBack={() => setView('LANDING')} />,
      'PRIVACY': <Privacy onBack={() => setView('LANDING')} />,
      'TESTIMONIALS': <Testimonials onBack={() => setView('LANDING')} />,
      'FAQS': <Faqs onBack={() => setView('LANDING')} />,
    };

    if (publicRoutes[view]) return publicRoutes[view];

    // Special Case: Editor is public (Guest Mode)
    if (view === 'EDITOR') return <Editor user={user} onNavigate={handleNavigate} logout={logout} />;

    if (!user) return <LandingPage onNavigate={setView} />;

    switch (view) {
      case 'DASHBOARD':
        return <Dashboard user={user} onNavigate={handleNavigate} logout={logout} />;
      case 'EDITOR':
        return <Editor user={user} onNavigate={handleNavigate} logout={logout} />;
      case 'PAYMENTS':
        return <PaymentsPage user={user} onNavigate={handleNavigate} logout={logout} onPurchase={addCredits} />;
      case 'ADMIN':
        return <AdminDashboard user={user} onNavigate={handleNavigate} logout={logout} />;
      case 'USERS':
        return <AdminUsers user={user} onNavigate={handleNavigate} logout={logout} />;
      case 'PAYMENTS_CONFIG':
        return <AdminPaymentsConfig user={user} onNavigate={handleNavigate} logout={logout} />;
      case 'CMS':
        return <AdminCMS user={user} onNavigate={handleNavigate} logout={logout} />;
      default:
        return <LandingPage onNavigate={setView} />;
    }
  };



  return (
    <TransformationProvider>
      <SalesProvider>
        <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white">
          {renderContent()}

          {user && (
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-dark/80 backdrop-blur-xl border-t border-border-dark px-6 py-3 flex justify-between items-center z-50">
              <button onClick={() => handleNavigate(user.role === UserRole.ADMIN ? 'ADMIN' : 'DASHBOARD')} className={`flex flex-col items-center gap-1 ${['DASHBOARD', 'ADMIN'].includes(view) ? 'text-primary' : 'text-gray-500'}`}>
                <span className="material-symbols-outlined">dashboard</span>
                <span className="text-[10px] font-bold">Home</span>
              </button>
              <button onClick={() => handleNavigate(user.role === UserRole.ADMIN ? 'USERS' : 'EDITOR')} className={`flex flex-col items-center gap-1 ${['EDITOR', 'USERS'].includes(view) ? 'text-primary' : 'text-gray-500'}`}>
                <span className="material-symbols-outlined">{user.role === UserRole.ADMIN ? 'group' : 'view_in_ar'}</span>
                <span className="text-[10px] font-bold">{user.role === UserRole.ADMIN ? 'Users' : 'Create'}</span>
              </button>
              <button onClick={() => handleNavigate(user.role === UserRole.ADMIN ? 'PAYMENTS_CONFIG' : 'PAYMENTS')} className={`flex flex-col items-center gap-1 ${['PAYMENTS', 'PAYMENTS_CONFIG'].includes(view) ? 'text-primary' : 'text-gray-500'}`}>
                <span className="material-symbols-outlined">payments</span>
                <span className="text-[10px] font-bold">Finance</span>
              </button>
              <button onClick={logout} className="flex flex-col items-center gap-1 text-red-500/70">
                <span className="material-symbols-outlined">logout</span>
                <span className="text-[10px] font-bold">Logout</span>
              </button>
            </nav>
          )}
        </div>
      </SalesProvider>
    </TransformationProvider>
  );
};

export default App;
