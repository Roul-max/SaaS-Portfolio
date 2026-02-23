from app.database import db

# Clear existing data
db.navlinks.delete_many({})
db.socials.delete_many({})
db.skills.delete_many({})
db.projects.delete_many({})
db.experience.delete_many({})
db.interests.delete_many({})

# ---------------- NAV LINKS ----------------
nav_links = [
    {"name": "Home", "href": "#home"},
    {"name": "About", "href": "#about"},
    {"name": "Skills", "href": "#skills"},
    {"name": "Projects", "href": "#projects"},
    {"name": "Experience", "href": "#experience"},
    {"name": "Contact", "href": "#contact"},
]
db.navlinks.insert_many(nav_links)

# ---------------- SOCIALS ----------------
socials = [
    {"name": "GitHub", "href": "https://github.com/Roul-max", "icon": "github"},
    {"name": "LinkedIn", "href": "http://www.linkedin.com/in/roul-max", "icon": "linkedin"},
    {"name": "Instagram", "href": "https://www.instagram.com/luv_roul", "icon": "instagram"},
]
db.socials.insert_many(socials)

# ---------------- SKILLS ----------------
skills = [
    {
        "category": "Frontend Development",
        "items": ["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Tailwind CSS", "Framer Motion"]
    },
    {
        "category": "Backend & Database",
        "items": ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs"]
    },
    {
        "category": "Tools & Workflow",
        "items": ["Git", "GitHub", "VS Code", "Figma", "Postman", "Vercel", "Netlify"]
    },
    {
        "category": "Soft Skills",
        "items": ["Fast Learner", "Problem Solving", "Teamwork", "Clear Communication"]
    }
]
db.skills.insert_many(skills)

# ---------------- PROJECTS ----------------
projects = [
    {
        "id": 1,
        "title": "Enterprise Resource Planning System",
        "category": "Full Stack Web Application",
        "description": "Production-grade University ERP system built with modular architecture and secure RBAC authentication.",
        "tech": ["React", "Node.js", "Express", "MongoDB", "JWT"],
        "image": "https://media.istockphoto.com/id/2193427065/photo/enterprise-resource-planning-concept-businessman-using-tablet-and-laptop-for-business.jpg?s=612x612&w=0&k=20&c=_cEv3bTjQJic_cEjAi-2mnlugvaw1qMfIcw4OYbw6hw=",
        "github": "https://github.com/Roul-max/ACE-ERP",
        "live": "https://ace-erp.vercel.app/",
        "impact": "RBAC authentication and API design."
    },
    {
        "id": 2,
        "title": "E-Commerce Platform",
        "category": "Web",
        "description": "Modern shopping platform with category filtering, secure checkout and Razorpay integration.",
        "tech": ["React", "Tailwind", "Razorpay"],
        "image": "https://t3.ftcdn.net/jpg/02/23/29/02/240_F_223290240_v1bFG4UKueXPxO8WXJUeN0QXj0yyiG7T.jpg",
        "github": "https://github.com/Roul-max/Impulse",
        "live": "https://impulseind.vercel.app/",
        "impact": "Secure payment gateway integration."
    },
    {
        "id": 3,
        "title": "Audio To Text Converter",
        "category": "Web",
        "description": "Speech-to-text application powered by OpenAI API.",
        "tech": ["React", "OpenAI", "Firebase"],
        "image": "https://media.istockphoto.com/id/1179997501/vector/podcast-line-button-white-colored-on-gradient-background-vector-illustration.webp?a=1&b=1&s=612x612&w=0&k=20&c=M77aCAhAF0K7vJFB056rFWMQMNW-SzfhU-1az6aHABs=",
        "github": "https://github.com/Roul-max/Speech",
        "live": "https://speech-beryl-theta.vercel.app/",
        "impact": "Implemented real-time speech transcription."
    },
    {
        "id": 4,
        "title": "Employee Management System",
        "category": "Web",
        "description": "Next.js application with full CRUD employee management.",
        "tech": ["Next.js", "Tailwind", "MongoDB"],
        "image": "https://t4.ftcdn.net/jpg/18/90/30/31/240_F_1890303112_FhCkDcEZYhC7RvBF1sYmvk7xvognaqtq.jpg",
        "github": "https://github.com/Roul-max/vizva",
        "live": "https://vizva-j5cw.vercel.app/login",
        "impact": "Implemented scalable CRUD architecture."
    },
    {
        "id": 5,
        "title": "Multi Tenant Manager",
        "category": "Web",
        "description": "Multi-tenant dashboard with real-time data visualization.",
        "tech": ["React", "Chart.js", "Axios"],
        "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
        "github": "https://github.com/Roul-max/Multi-Tenant",
        "live": "https://multi-tenant.vercel.app/",
        "impact": "Designed multi-tenant architecture."
    },
    {
        "id": 6,
        "title": "Password Generator",
        "category": "Web",
        "description": "Secure password generator with AI-based strength validation.",
        "tech": ["React", "Python", "OpenAI"],
        "image": "https://images.unsplash.com/photo-1633265486064-086b219458ec",
        "github": "https://github.com/Roul-max/Password-Generator",
        "live": "https://password-generator-alpha-dun.vercel.app/",
        "impact": "Implemented secure password generation logic."
    }
]

db.projects.insert_many(projects)

# ---------------- EXPERIENCE ----------------
experience = [
    {
        "role": "Full Stack Intern",
        "company": "Croma Campus Pvt. Ltd.",
        "period": "05/2025 - 08/2025",
        "description": "Developed dashboard modules and fixed production bugs.",
        "highlights": ["React hooks", "API integration", "Unit testing"]
    },
    {
        "role": "Frontend Developer",
        "company": "AICTE",
        "period": "03/2025 - 04/2025",
        "description": "Built responsive UI for AICTE platform.",
        "highlights": ["UI/UX design", "Responsive design", "Open source contribution"]
    }
]
db.experience.insert_many(experience)

# ---------------- INTERESTS ----------------
interests = [
    {"name": "Photography", "icon": "camera"},
    {"name": "Travel", "icon": "globe"},
    {"name": "Open Source", "icon": "code"},
    {"name": "Gaming", "icon": "terminal"},
]
db.interests.insert_many(interests)

print("✅ Portfolio data inserted successfully!")