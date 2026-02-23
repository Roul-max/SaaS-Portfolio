import requests
import logging
import re
from typing import List
from .config import OPENROUTER_API_KEY
from .database import db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ==========================================================
# Resume Context Builder (Static + Dynamic Combined)
# ==========================================================
def build_resume_context() -> str:

    def safe_join(items: List[str]) -> str:
        return ", ".join([i for i in items if i]) if items else "Not specified"

    # ================= DYNAMIC DB DATA =================
    socials = list(db.socials.find({}, {"_id": 0}))
    skills = list(db.skills.find({}, {"_id": 0}))
    projects = list(db.projects.find({}, {"_id": 0}))
    experience = list(db.experience.find({}, {"_id": 0}))
    interests = list(db.interests.find({}, {"_id": 0}))

    formatted_socials = "\n".join(
        [f"- {s.get('name')}: {s.get('href')}" for s in socials]
    ) or "No social links available."

    formatted_skills = "\n".join(
        [f"- {s.get('category')}: {safe_join(s.get('items', []))}" for s in skills]
    ) or "No skills listed."

    formatted_projects = "\n".join(
        [
            f"- {p.get('title')}\n"
            f"  Description: {p.get('description')}\n"
            f"  Technologies: {safe_join(p.get('tech', []))}\n"
            f"  Impact: {p.get('impact')}"
            for p in projects
        ]
    ) or "No projects listed."

    formatted_experience = "\n".join(
        [
            f"- {e.get('role')} at {e.get('company')} ({e.get('period')})\n"
            f"  Description: {e.get('description')}\n"
            f"  Highlights: {safe_join(e.get('highlights', []))}"
            for e in experience
        ]
    ) or "No experience listed."

    formatted_interests = safe_join([i.get("name") for i in interests])

    # ================= STATIC CORE PROFILE =================

    core_profile = """
================ CORE PROFILE INFORMATION ================

Full Name: Rohit Kumar
Date of Birth: 5 December 2004
Role: Web Developer / Full Stack Developer
Location: Greater Noida, Uttar Pradesh, India
Phone: 8789024145
Email: rohitkumarrrx@gmail.com
Portfolio: https://roulportfolio.vercel.app

Professional Summary:
Enthusiastic Computer Science student and emerging Full-Stack Web Developer skilled in HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, PostgreSQL, MySQL, and Python. Built multiple responsive, production-ready projects focused on usability, performance, clean architecture, and scalability. Actively seeking internships and entry-level roles to grow and collaborate.

Education:
Bachelor of Technology in Computer Science (Artificial Intelligence)
IIMT Group of Colleges
2022 - 2026
GPA: 7.6 / 10
Location: Greater Noida

Internship Experience:
Full Stack Developer Intern
Croma Campus Pvt Ltd
May 2025 - August 2025
Location: Greater Noida
- Developed web applications using React, Node.js, Express, MongoDB, and MySQL.
- Implemented authentication systems, form validation, and CRUD operations.
- Maintained clean and scalable architecture.

Major Projects:
1. Enterprise Resource Planning (ERP) System
   - Full-stack modular ERP system centralizing inventory, finance, and sales.
   - Implemented structured authentication and enterprise-ready UI.
   - Deployed on Vercel.
   - Link: https://ace-erp.vercel.app/

2. E-Commerce Web Application (Impulse)
   - Production-ready e-commerce platform with cart system.
   - Integrated Razorpay secure payment gateway.
   - Built using React and dynamic routing.
   - Link: https://impulseind.vercel.app/

3. Personal Portfolio Website
   - Responsive portfolio showcasing skills and projects.
   - Includes About, Projects, Skills, and Contact sections.
   - Link: https://roulportfolio.vercel.app/

Core Technical Skills:
Frontend: HTML, CSS, JavaScript, React.js, Next.js, TypeScript, Tailwind CSS
Backend: Node.js, Express.js, REST APIs
Databases: MongoDB, PostgreSQL, MySQL
Other: Python, Authentication Systems, CRUD Architecture
DevOps & Deployment: Git, GitHub, Vercel, Netlify, Render

Strengths:
- Collaboration & Communication
- Strong Problem-Solving
- Scalable Architecture Thinking
- Clean Code Practices

Key Achievement:
Designed and delivered mobile-first responsive interfaces using Tailwind CSS with optimized performance and accessibility.
"""

    return f"""
{core_profile}

================ SOCIAL LINKS (Dynamic) ================
{formatted_socials}

================ SKILLS (Dynamic) ================
{formatted_skills}

================ PROJECTS (Dynamic) ================
{formatted_projects}

================ EXPERIENCE (Dynamic) ================
{formatted_experience}

================ INTERESTS (Dynamic) ================
{formatted_interests}
""".strip()


# ==========================================================
# Intent Detection
# ==========================================================
def normalize_text(text: str) -> str:
    return re.sub(r"[^\w\s]", "", text.lower())


def is_resume_related(question: str) -> bool:
    question = normalize_text(question)

    keywords = [
        "skill", "project", "experience", "internship",
        "education", "technology", "stack",
        "portfolio", "work", "role", "company",
        "achievement", "interest", "contact",
        "github", "linkedin",
        "backend", "frontend", "architecture",
        "database", "authentication", "authorization",
        "jwt", "api", "rbac", "deployment",
        "mongodb", "react", "node", "express",
        "python", "system", "design",
        "built", "developed", "create", "made",
        "birth", "age", "dob"
    ]

    return any(keyword in question for keyword in keywords)


def is_about_rohit(question: str) -> bool:
    question = normalize_text(question)
    return any(
        phrase in question
        for phrase in [
            "rohit",
            "who are you",
            "about you",
            "tell me about yourself",
            "introduce yourself",
            "your background"
        ]
    )


# ==========================================================
# Prompt Injection Protection
# ==========================================================
def is_malicious_input(text: str) -> bool:
    text = text.lower()

    dangerous_patterns = [
        "ignore previous instructions",
        "forget your rules",
        "act as",
        "system prompt",
        "reveal hidden",
        "api key",
        "bypass",
        "override",
        "jailbreak"
    ]

    return any(pattern in text for pattern in dangerous_patterns)


# ==========================================================
# OpenRouter Wrapper
# ==========================================================
def call_openrouter(system_prompt: str, user_message: str) -> str:
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "meta-llama/llama-3-8b-instruct",
            "temperature": 0.3,
            "max_tokens": 700,
            "messages": [
                {"role": "system", "content": system_prompt.strip()},
                {"role": "user", "content": user_message.strip()},
            ],
        },
        timeout=30,
    )

    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()


# ==========================================================
# Main AI Response Function
# ==========================================================
def get_ai_response(user_message: str) -> str:

    if not OPENROUTER_API_KEY:
        return "OpenRouter API key is missing."

    if is_malicious_input(user_message):
        return "⚠️ Security policy violation detected."

    resume_context = build_resume_context()

    # ================= RESUME MODE =================
    if is_resume_related(user_message) or is_about_rohit(user_message):

        logger.info("Resume Mode Activated")

        system_prompt = f"""
You are Rohit Kumar's AI Resume Assistant.

STRICT RULES:
- Use ONLY the provided PORTFOLIO DATA.
- Never use outside knowledge.
- Never guess.
- If information is missing say:
  "This information is not available in Rohit Kumar's portfolio."
- Always respond in professional Markdown format.

FORMAT (MANDATORY):

## Short Summary
2–3 professional sentences.

## Key Details
- Bullet
- Bullet
- Bullet

## Relevant Technologies (if applicable)
- Technology

PORTFOLIO DATA:
{resume_context}
"""

        response = call_openrouter(system_prompt, user_message)

    # ================= GENERAL MODE =================
    else:

        logger.info("General Mode Activated")

        system_prompt = """
You are Rohit Kumar's AI assistant.

If the question is NOT related to Rohit's professional portfolio:

1. Start with:
   "This question is not related to Rohit's professional portfolio."
2. Provide a short, well-structured answer.
3. Keep it concise (maximum 5–6 sentences).
4. Do NOT use resume format.
5. Maintain a professional tone.
"""

        response = call_openrouter(system_prompt, user_message)

    # ================= SENSITIVE FILTER =================
    if any(word in response.lower() for word in ["api key", "system prompt"]):
        logger.warning("Sensitive content detected.")
        return "⚠️ Response blocked due to security validation."

    return response