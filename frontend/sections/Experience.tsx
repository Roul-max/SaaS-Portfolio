import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

const Experience: React.FC = () => {
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL+"/experience");
        const data = await res.json();
        setExperience(data);
      } catch (error) {
        console.error("Failed to fetch experience:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  return (
    <section
      id="experience"
      className="py-32 bg-slate-50 dark:bg-[#0d121f] scroll-mt-navbar px-6 transition-colors"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4 block">
            Evolution
          </span>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            The <span className="text-indigo-600">Timeline.</span>
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">
            Loading experience...
          </p>
        ) : (
          <div className="space-y-12 relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

            {experience.map((exp, index) => (
              <motion.div
                key={`${exp.role}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-12 ${
                  index % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                }`}
              >
                <div className="absolute left-8 md:left-1/2 -ml-[11px] w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-600 shadow-2xl z-10" />

                <div className="w-full md:w-1/2 pl-16 md:pl-0">
                  <div
                    className={`group p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 ${
                      index % 2 === 0
                        ? "md:text-right"
                        : "md:text-left"
                    }`}
                  >
                    <span className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-black text-xs rounded-full mb-6">
                      {exp.period}
                    </span>

                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 leading-tight">
                      {exp.role}
                    </h3>

                    <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-6 text-lg">
                      {exp.company}
                    </p>

                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                      {exp.description}
                    </p>

                    <div
                      className={`flex flex-wrap gap-2 ${
                        index % 2 === 0
                          ? "md:justify-end"
                          : "md:justify-start"
                      }`}
                    >
                      {exp.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-[11px] font-bold text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 px-3 py-1 rounded-xl"
                        >
                          • {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:block w-1/2" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;