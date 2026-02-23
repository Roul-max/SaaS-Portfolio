import React from "react";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-grid"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse delay-700" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400" />
            </span>
            Available for New Projects
          </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white leading-tight sm:leading-[0.9] md:leading-[0.85] mb-8 tracking-tight break-words">
  Architecting <br className="hidden sm:block" />
  <span className="text-gradient">Digital Flow.</span>
</h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-xl font-medium">
            I am a Frontend Devloper in building
            <span className="text-slate-900 dark:text-white font-bold">
              {" "}
              high-performance systems
            </span>{" "}
            and
            <span className="text-slate-900 dark:text-white font-bold">
              {" "}
              immersive interfaces
            </span>
            . Turning complex problems into elegant, scalable reality.
          </p>

          <div className="flex flex-wrap gap-5 mb-16">
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="px-8 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2"
            >
              View My Work
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="/Resume.pdf"
              download
              className="px-8 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-lg flex items-center gap-2"
            >
              Download Resume
            </motion.a>
          </div>
        </motion.div>

        {/* Right Visual (NOW RESPONSIVE) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative z-10 group w-full max-w-md lg:max-w-none scale-90 sm:scale-95 lg:scale-100">
            <div className="bg-slate-900/95 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">

              <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                  Rohit_portfolio.jsx
                </div>
                <div className="w-10" />
              </div>

              <div className="p-6 sm:p-8 font-mono text-sm leading-relaxed space-y-1">
                <div className="text-purple-400">
                  const <span className="text-blue-400">Developer</span> = {"{"}
                </div>
                <div className="pl-4 text-slate-300">
                  name: <span className="text-emerald-400">'Rohit Kumar'</span>,
                </div>
                <div className="pl-4 text-slate-300">
                  role: <span className="text-emerald-400">'Frontend Developer'</span>,
                </div>
                <div className="pl-4 text-slate-300">
                  passion: <span className="text-emerald-400">'Scalable Architecture'</span>,
                </div>
                <div className="pl-4 text-slate-300">
                  status: <span className="text-indigo-400">OPEN_FOR_WORK</span>,
                </div>
                <div className="pl-4 text-slate-300">
                  location: <span className="text-emerald-400">'On-Site / Remote'</span>
                </div>
                <div className="text-purple-400">{"};"}</div>
                <div className="pt-4 text-slate-500 animate-pulse">
                  _ // Listening for new opportunities
                </div>
              </div>
            </div>

            <div className="absolute -inset-10 border border-indigo-500/10 rounded-[3rem] rotate-3 pointer-events-none hidden sm:block" />
            <div className="absolute -inset-20 border border-purple-500/10 rounded-[4rem] -rotate-6 pointer-events-none hidden sm:block" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
