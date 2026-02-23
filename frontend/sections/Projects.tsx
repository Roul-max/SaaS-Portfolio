import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  github: string;
  live: string;
  impact: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const API = import.meta.env.VITE_API_URL;

        if (!API) {
          throw new Error("VITE_API_URL is not defined");
        }

        const res = await fetch(`${API}/projects`);

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data: Project[] = await res.json();

        if (isMounted) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Fetch Projects Error:", err);
        if (isMounted) {
          setError("Unable to load projects.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="projects"
      className="py-32 bg-white dark:bg-[#0b0f1a] scroll-mt-navbar px-6 transition-colors"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-[10px] mb-4 block">
            My Creations
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-6">
            Projects <span className="text-indigo-600">Gallery.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            Exploring different domains from frontend interfaces to AI
            integration. Click to see the live demos and code.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-slate-500">
            Loading projects...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 font-medium">
            {error}
          </p>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <motion.div
                  key={`${project.id}-${project.title}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 transition-all hover:shadow-2xl"
                >

                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">

                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-white text-indigo-600 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                        >
                          <ExternalLink size={20} />
                        </a>

                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                        >
                          <Github size={20} />
                        </a>

                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Impact */}
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Growth: {project.impact}
                      </p>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Projects;