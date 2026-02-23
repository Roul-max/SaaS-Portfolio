import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, ArrowUp } from "lucide-react";

interface Social {
  name: string;
  href: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  instagram: <Instagram size={18} />,
};

const Footer: React.FC = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL+"/socials");
        const data = await res.json();
        setSocials(data);
      } catch (error) {
        console.error("Failed to fetch socials:", error);
      }
    };

    fetchSocials();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-slate-900 dark:bg-[#080b14] text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        
        {/* Left */}
        <div className="text-center md:text-left">
          <h3 className="text-3xl font-black mb-4 tracking-tighter">
            Personal Portfolio<span className="text-indigo-500">.</span>
          </h3>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
            Building digital experiences that matter with precision engineering
            and high-end design.
          </p>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4">
            {socials.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all"
              >
                {iconMap[social.icon.toLowerCase()]}
              </motion.a>
            ))}
          </div>

          <p className="text-slate-500 text-xs">
            © {currentYear} Crafted with Passion.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <motion.button
            whileHover={{ y: -5 }}
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 font-bold transition-colors"
          >
            Back to Top
            <span className="p-1 bg-white/5 rounded-full group-hover:bg-indigo-600 transition-colors">
              <ArrowUp size={16} />
            </span>
          </motion.button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;