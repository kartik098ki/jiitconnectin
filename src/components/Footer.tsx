import React from 'react';
import { Printer } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center gap-2">
            <Printer className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">JIIT<span className="text-primary">Connect</span></span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} JIIT Connect. Made for students, by students.
          </p>
          <div className="text-sm text-gray-500">
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-primary">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
