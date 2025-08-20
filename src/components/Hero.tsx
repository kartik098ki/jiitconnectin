import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Upload } from 'lucide-react';

interface HeroProps {
  onOpenAuth: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAuth }) => {
  return (
    <section id="home" className="relative bg-white pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-block"
          >
            <span className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
              <Upload className="w-4 h-4 mr-2" />
              No More Waiting in Line
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Skip the Queue.
            <br />
            <span className="text-primary">Print from Anywhere.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your documents from class, your dorm, or the library. We'll have them ready for you to collect from the print shop in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAuth}
              className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg shadow-lg shadow-primary/30 hover:bg-primary-700 transition-all duration-300 flex items-center gap-2"
            >
              Login & Start Printing
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Exclusively for JIIT students.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
