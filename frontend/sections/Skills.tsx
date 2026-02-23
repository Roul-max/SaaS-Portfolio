import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SkillGroup {
  category: string;
  items: string[];
}

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL+"/skills");
        const data = await res.json();
        setSkills(data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section
      id="skills"
      className="py-24 bg-slate-50 dark:bg-[#0d121f] scroll-mt-navbar px-6 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-[10px] mb-4 block">
              Competencies
            </span>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              My <span className="text-indigo-600">Tech Stack.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              As a fresher, I focus on building a strong foundation in modern
              web technologies. I am constantly learning and expanding this list
              through hands-on projects.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-8 space-y-12">
            {loading ? (
              <p className="text-slate-500">Loading skills...</p>
            ) : (
              skills.map((group, gIdx) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: gIdx * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                    {group.category}
                    <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800 group-hover:bg-indigo-500/30 transition-colors" />
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {group.items.map((skill) => (
                      <motion.span
                        key={skill}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;