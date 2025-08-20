import React, { useState, useEffect } from 'react';
import { Menu, X, Printer, User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../App';

interface NavigationProps {
  onOpenAuth: () => void;
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onOpenAuth, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'How It Works'];

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <a href="#" className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <Printer className="w-8 h-8 text-primary" />
            <span>JIIT<span className="text-primary">Connect</span></span>
          </a>

          {/* Desktop Menu */}
          {!user && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Hi, {user.name.split(' ')[0]}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium shadow-md hover:bg-primary-700 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Login
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 rounded-lg mb-4 shadow-lg"
            >
              <div className="px-4 py-4 space-y-4">
                {!user && navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="block text-gray-600 hover:text-primary transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  {user ? (
                     <button
                        onClick={() => { onLogout(); setIsOpen(false); }}
                        className="block w-full text-left text-primary font-medium"
                      >
                        Logout
                      </button>
                  ) : (
                     <button
                        onClick={() => { onOpenAuth(); setIsOpen(false); }}
                        className="block w-full text-left text-primary font-medium"
                      >
                        Login
                      </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navigation;
