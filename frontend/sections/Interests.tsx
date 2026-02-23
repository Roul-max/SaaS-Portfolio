import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Globe, Code, Terminal } from "lucide-react";

interface Interest {
  name: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  camera: <Camera size={22} />,
  globe: <Globe size={22} />,
  code: <Code size={22} />,
  terminal: <Terminal size={22} />,
};

const Interests: React.FC = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL+"/interests");
        const data = await res.json();
        setInterests(data);
      } catch (error) {
        console.error("Failed to fetch interests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#0d121f] px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-[10px] mb-4 block">
            Personal Side
          </span>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Beyond the <span className="text-indigo-600">Code.</span>
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">
            Loading interests...
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-xl shadow-sm"
              >
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {iconMap[interest.icon.toLowerCase()]}
                </div>

                <p className="font-black text-slate-900 dark:text-white tracking-wide">
                  {interest.name}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Interests;