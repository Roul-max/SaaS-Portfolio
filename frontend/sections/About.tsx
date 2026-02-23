
import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-white dark:bg-[#0b0f1a] transition-colors scroll-mt-navbar px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <img 
                src="/profile.jpeg" 
                alt="Profile" 
                className="relative rounded-[2.5rem] shadow-2xl w-full object-cover aspect-square "
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
              Crafting experiences that <span className="text-gradient">leave a mark.</span>
            </h2>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              <p>
                My journey in tech fueled by an insatiable curiosity for 
                bridging the gap between design and complex engineering. Today, I build 
                web applications that don't just work—they inspire.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors">
                  <h4 className="font-black text-slate-900 dark:text-white text-xl mb-2">Philosophy</h4>
                  <p className="text-sm">Minimum bloat, maximum performance. I believe the best code is the one you never had to write.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors">
                  <h4 className="font-black text-slate-900 dark:text-white text-xl mb-2">Mission</h4>
                  <p className="text-sm">To empower businesses through digital excellence and accessible, future-proof software architecture.</p>
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
