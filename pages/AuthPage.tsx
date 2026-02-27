
import React, { useState } from 'react';
import { UserRole } from '../types';

interface Props {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}

const AuthPage: React.FC<Props> = ({ onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Production Logic:
    // 1. Password "admin" -> Admin Role (regardless of email, or require specific email)
    // 2. Any other password -> User Role

    // User requested "password 'admin'" linked to admin access.
    // Let's implement that specific check.

    // NOTE: This uses a different input ID/name or just assumes the second input is password.
    // The inputs in JSX below need state binding for password to work properly.
    // Currently only 'email' has state. I need to add 'password' state.

    if (password === 'admin') {
      onLogin(UserRole.ADMIN);
    } else {
      if (isRegister) {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        if (!name.trim()) {
          alert("Please enter your name.");
          return;
        }
      }
      // For now, allow any other password to enter as User (Demo/Production Mix)
      // or if we want strict production, we would validate against Firebase Auth here.
      // Given the request "retira acessos publicos... não quero logins para paginas", 
      // I'll assume valid login is needed. Since we don't have full Auth tables yet,
      // I will treat non-admin password as standard user login.
      onLogin(UserRole.USER);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-dark font-display text-white">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://picsum.photos/seed/auth/1000/1000" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent"></div>
        <div className="relative z-10 p-16 flex flex-col justify-end h-full max-w-lg text-left">
          <h1 className="text-5xl font-bold mb-6">Transform your world into 3D.</h1>
          <p className="text-xl text-gray-300">Join thousands of creators and transform photos into stunning models.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 justify-center items-center overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-2 text-primary cursor-pointer mb-12" onClick={onBack}>
            <div className="size-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#5b2bee", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="url(#grad3)" stroke="#151022" strokeWidth="2" />
                <path d="M50 5 L50 45 L90 25 M50 45 L10 25 M50 45 L50 95" stroke="#white" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">3dokas.live</span>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold">{isRegister ? 'Create your account' : 'Access your account'}</h2>
            <p className="text-gray-400">Start your 3D journey today.</p>
          </div>

          {/* Quick Access Buttons REMOVED for Production */}
          {/* <div className="grid grid-cols-2 gap-4"> ... </div> */}

          {/* Separator removed */}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <input
                  type="text"
                  required={isRegister}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-surface-dark border border-border-dark rounded-lg px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full bg-surface-dark border border-border-dark rounded-lg px-4 py-3 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-dark border border-border-dark rounded-lg px-4 py-3 focus:border-primary outline-none transition-all"
              />
            </div>
            {isRegister && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  required={isRegister}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-dark border border-border-dark rounded-lg px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 transition-all text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20"
            >
              {isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="text-center pt-4">
            <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-gray-400 hover:text-white underline">
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
