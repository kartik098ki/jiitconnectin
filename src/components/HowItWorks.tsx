import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Bell, ShoppingBag } from 'lucide-react';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      icon: <Upload className="w-8 h-8 text-primary" />,
      title: 'Upload Document',
      description: 'Login with your college ID, upload your file, and choose your print options.',
    },
    {
      icon: <Bell className="w-8 h-8 text-primary" />,
      title: 'Get Notified',
      description: 'We’ll process your file and send you a notification when it’s ready for pickup.',
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-primary" />,
      title: 'Collect & Go',
      description: 'Head to the print shop, show your order, and collect your prints. It’s that simple!',
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Printing in 3 Easy Steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our entire process is designed to be fast, simple, and convenient for you.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute top-12 left-0 w-full h-0.5 bg-gray-200 hidden md:block" aria-hidden="true"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-center"
              >
                <div className="relative flex items-center justify-center mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-1/2 translate-x-1/2 md:-top-9 md:right-auto md:translate-x-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl shadow-md">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {step.title}
                </h3>
                
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
