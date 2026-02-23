import requests
import logging
import re
from typing import List
from .config import OPENROUTER_API_KEY
from .database import db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==========================================================
# Resume Context Builder
# ==========================================================
def build_resume_context() -> str:
    def safe_join(items: List[str]) -> str:
        return ", ".join([i for i in items if i]) if items else "Not specified"

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

    return f"""
Name: Rohit Kumar
Role: Computer Science Student & Full Stack Developer

=== SOCIAL LINKS ===
{formatted_socials}

=== SKILLS ===
{formatted_skills}

=== PROJECTS ===
{formatted_projects}

=== EXPERIENCE ===
{formatted_experience}

=== INTERESTS ===
{formatted_interests}
""".strip()


# ==========================================================
# Intent Detection
# ==========================================================
def is_resume_related(question: str) -> bool:
    question = question.lower()
    question = re.sub(r"[^\w\s]", "", question)

    resume_keywords = [
        "skill", "project", "experience", "internship",
        "education", "technology", "stack",
        "portfolio", "work", "role", "company",
        "achievement", "interest", "contact",
        "github", "linkedin", "backend", "frontend",
        "architecture", "database", "authentication",
        "authorization", "jwt", "api", "rbac",
        "deployment", "mongodb", "react",
        "node", "express", "python",
        "system", "design", "built", "developed",
        "create", "made",
        "rohit", "yourself", "about you"
    ]

    return any(keyword in question for keyword in resume_keywords)


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
# OpenRouter Call
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
# Main AI Function
# ==========================================================
def get_ai_response(user_message: str) -> str:

    if not OPENROUTER_API_KEY:
        return "OpenRouter API key is missing."

    if is_malicious_input(user_message):
        return "⚠️ Security policy violation detected."

    resume_context = build_resume_context()

    # ---------------- RESUME MODE ----------------
    if is_resume_related(user_message):

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

    # ---------------- GENERAL MODE ----------------
    else:

        system_prompt = """
You are a helpful, professional AI assistant.

- Provide clear, well-structured answers.
- Do NOT use resume summary format.
- Use headings and bullet points when helpful.
- Keep responses concise but informative.
"""

        response = call_openrouter(system_prompt, user_message)

    # Basic sensitive check
    if any(word in response.lower() for word in ["api key", "system prompt"]):
        return "⚠️ Response blocked due to security validation."

    return response