import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

interface Social {
  name: string;
  href: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={22} />,
  linkedin: <Linkedin size={22} />,
  instagram: <Instagram size={22} />,
};

const Contact: React.FC = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // ✅ Fetch socials from database
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL+"/socials");
        const data = await res.json();
        setSocials(data);
      } catch (err) {
        console.error("Failed to fetch socials:", err);
      }
    };

    fetchSocials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const formBody = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      await fetch(
        "https://script.google.com/macros/s/AKfycbz1gbs1S9V2b1And0XDAY3Fo_MT4O3Tm_vi3nuBe5EYBHr0EaUnHTf0fU376RDbEkrgjA/exec",
        {
          method: "POST",
          body: formBody,
        }
      );

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section
      id="contact"
      className="py-32 bg-white dark:bg-[#0b0f1a] px-6 transition-colors"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 border border-slate-800">
          <div className="grid lg:grid-cols-2 gap-20">

            {/* LEFT SIDE */}
            <div>
              <h2 className="text-5xl font-black text-white mb-8">
                Let's make <br />
                <span className="text-indigo-500">
                  something iconic.
                </span>
              </h2>

              <p className="text-slate-400 text-xl mb-12">
                I'm currently looking for new opportunities and collaborations.
              </p>

              {/* Contact Info */}
              <div className="space-y-8 mb-12">
                <div className="flex items-center gap-6">
                  <Mail className="text-white" size={22} />
                  <div>
                    <p className="text-slate-500 text-xs uppercase">
                      Direct Mail
                    </p>
                    <p className="text-white font-bold">
                      rohitkumarrrx@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <MapPin className="text-white" size={22} />
                  <div>
                    <p className="text-slate-500 text-xs uppercase">
                      Location
                    </p>
                    <p className="text-white font-bold">
                      Hybrid / India
                    </p>
                  </div>
                </div>
              </div>

              {/* Socials From Database */}
              <div>
                <p className="text-slate-500 text-xs uppercase mb-6">
                  Social Connect
                </p>
                <div className="flex gap-4">
                  {socials.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"
                    >
                      {iconMap[social.icon.toLowerCase()]}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10"
            >
              <div className="space-y-6">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white"
                />

                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white"
                />

                <textarea
                  required
                  rows={4}
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3"
                >
                  {status === "loading" ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : status === "success" ? (
                    "Message Sent!"
                  ) : status === "error" ? (
                    "Error!"
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.form>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;