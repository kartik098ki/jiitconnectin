import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const About: React.FC = () => {
  const achievements = [
    'Modern React & TypeScript',
    'Responsive Design',
    'Beautiful Animations',
    'Performance Optimized',
    'SEO Friendly',
    'Accessibility Focused'
  ];

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About Our Vision
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We believe in creating digital experiences that not only look stunning 
              but also provide exceptional functionality and user experience. Our approach 
              combines cutting-edge technology with timeless design principles.
            </p>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    100+
                  </motion.div>
                  <p className="text-gray-300">Projects Completed</p>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    99%
                  </motion.div>
                  <p className="text-gray-300">Client Satisfaction</p>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    24/7
                  </motion.div>
                  <p className="text-gray-300">Support Available</p>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    5★
                  </motion.div>
                  <p className="text-gray-300">Average Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
